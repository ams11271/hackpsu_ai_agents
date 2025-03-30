from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
import os
from typing import List
import tempfile
from agents import chunk_text, generate_report, simplify_clause, simplifier
from docx import Document
import re
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from transformers import pipeline
from vectorize import retrieve_similar_segments, extract_text_from_docx, segment_text

# Initialize the summarization pipeline with t5-small
summarizer = pipeline("summarization", model="t5-small", tokenizer="t5-small")

# --------------------------
# Step 1: Document Processing
# --------------------------

def count_sentences(text):
    """Count the number of sentences in a text."""
    sentences = re.split(r'[.!?]+', text)
    return len([s for s in sentences if s.strip()])

def summarize_text(text):
    """Generate a concise summary of the text using t5-small, limited to 4 sentences."""
    try:
        # If text is short enough, no need to summarize
        if len(text.split()) < 50:
            return text

        # Split into chunks if text is too long
        chunks = chunk_text(text)
        summaries = []
        
        for chunk in chunks:
            # Generate a very concise summary for each chunk
            summary = summarizer(chunk, 
                               max_length=80,    # Reduced for more concise summaries
                               min_length=20,    # Reduced for more concise summaries
                               do_sample=False,   # Deterministic output
                               num_beams=4,       # Beam search for better quality
                               early_stopping=True)[0]['summary_text']
            
            # Ensure the summary doesn't exceed 4 sentences
            sentences = re.split(r'[.!?]+', summary)
            sentences = [s.strip() for s in sentences if s.strip()]
            if len(sentences) > 4:
                summary = '. '.join(sentences[:4]) + '.'
            
            summaries.append(summary)
        
        # Combine summaries if there are multiple chunks
        final_summary = ' '.join(summaries)
        
        # Final check to ensure the combined summary doesn't exceed 4 sentences
        sentences = re.split(r'[.!?]+', final_summary)
        sentences = [s.strip() for s in sentences if s.strip()]
        if len(sentences) > 4:
            final_summary = '. '.join(sentences[:4]) + '.'
        
        return final_summary
    except Exception as e:
        print(f"Error in summarization: {str(e)}")
        return text

def generate_report(query, k=3):
    """Generate a summarized report based on the query."""
    segments = retrieve_similar_segments(query, k)
    report_parts = []
    
    for i, segment in enumerate(segments, 1):
        # Generate a concise summary for each segment
        summary = summarize_text(segment)
        report_parts.append(f"Clause {i}:\n{summary}")
    
    return "\n\n".join(report_parts)

# --------------------------
# Step 2: Semantic Search
# --------------------------

# Initialize the embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Global variables to store the current document state
current_segments = []
current_embeddings = None
current_index = None

def initialize_search(segments):
    """Initialize the search index with new segments."""
    global current_segments, current_embeddings, current_index
    current_segments = segments
    current_embeddings = model.encode(segments, convert_to_numpy=True)
    dimension = current_embeddings.shape[1]
    current_index = faiss.IndexFlatL2(dimension)
    current_index.add(current_embeddings)


# --------------------------
# Step 3: FastAPI Integration
# --------------------------

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    k: int = 3

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """Handle multiple file uploads."""
    try:
        temp_dir = tempfile.mkdtemp()
        file_paths = []
        
        for file in files:
            if not file.filename.endswith('.docx'):
                raise HTTPException(status_code=400, detail="Only .docx files are supported")
            
            file_path = os.path.join(temp_dir, file.filename)
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            file_paths.append(file_path)
        
        # Process the uploaded files
        print("Processing uploaded documents...")
        text = extract_text_from_docx(file_paths)
        segments = segment_text(text)
        print(f"Total segments extracted: {len(segments)}")
        
        # Initialize search with new segments
        initialize_search(segments)
        
        # Clean up temporary files
        for file_path in file_paths:
            os.remove(file_path)
        os.rmdir(temp_dir)
        
        return JSONResponse({
            "message": f"Successfully processed {len(files)} files",
            "segments_count": len(segments)
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/report")
async def get_report(request: QueryRequest):
    """Generate a report based on the query."""
    try:
        report = generate_report(request.query, request.k)
        return {"report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def read_root():
    return {"message": "ClauseSense API. Upload documents and query them for legal analysis."}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)