from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from docx import Document
import re
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from transformers import pipeline

# --------------------------
# Step 1: Document Ingestion & Preprocessing
# --------------------------

# Use your provided file path
file_path = r'/Users/arya/Downloads/Model-VA-10-24-2024.docx'

def extract_text_from_docx(file_path):
    """Extract text from a DOCX file."""
    doc = Document(file_path)
    full_text = []
    for para in doc.paragraphs:
        text = para.text.strip()
        if text:
            full_text.append(text)
    return "\n".join(full_text)

def segment_text(text):
    """
    Segment text into chunks using common legal markers.
    Adjust the regex if necessary.
    """
    segments = re.split(r'\n(?=WHEREAS|Section|Definitions|RECITALS|AMENDED)', text, flags=re.IGNORECASE)
    return [seg.strip() for seg in segments if seg.strip()]

def chunk_text(text, max_words=500):
    """Split text into chunks of specified maximum length."""
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    
    for word in words:
        current_chunk.append(word)
        current_length += 1
        if current_length >= max_words:
            chunks.append(' '.join(current_chunk))
            current_chunk = []
            current_length = 0
    
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks

print("Processing document...")
text = extract_text_from_docx(file_path)
segments = segment_text(text)
print(f"Total segments extracted: {len(segments)}")

# Process each segment into smaller chunks
chunked_segments = []
for segment in segments:
    chunks = chunk_text(segment)
    chunked_segments.extend(chunks)

print(f"Total chunks after processing: {len(chunked_segments)}")

# --------------------------
# Step 2: Vectorization & Indexing with FAISS
# --------------------------

# Initialize the embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Convert segments to embeddings
embeddings = model.encode(chunked_segments, convert_to_numpy=True)

# Build a FAISS index using L2 (Euclidean) distance
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

def retrieve_similar_segments(query, k=3):
    """Given a query, retrieve the top k most similar segments."""
    query_vec = model.encode([query], convert_to_numpy=True)
    distances, indices = index.search(query_vec, k)
    results = [chunked_segments[i] for i in indices[0]]
    return results

# --------------------------
# Step 3: Summarization (Simplifier) Agent
# --------------------------

# Initialize the summarization pipeline using T5-small
simplifier = pipeline("summarization", model="t5-small", tokenizer="t5-small")

def estimate_token_length(text):
    """Estimate the number of tokens in a text (rough approximation)."""
    # T5 tokenizer roughly splits on spaces and punctuation
    return len(text.split()) * 1.3  # Rough estimate: 1.3 tokens per word

def simplify_clause(clause):
    """Simplify a legal clause using the summarizer."""
    try:
        # Check if the clause is long enough to summarize
        if len(clause.split()) < 50:
            return clause
            
        # Split long clauses into smaller chunks (max 400 words to stay under 512 tokens)
        chunks = chunk_text(clause, max_words=400)
        simplified_chunks = []
        
        for chunk in chunks:
            # Check if chunk is too long
            if estimate_token_length(chunk) > 500:  # Leave some margin
                # Further split the chunk if needed
                sub_chunks = chunk_text(chunk, max_words=300)
                for sub_chunk in sub_chunks:
                    summary = simplifier(sub_chunk, max_length=100, min_length=30, do_sample=False)[0]['summary_text']
                    simplified_chunks.append(summary)
            else:
                summary = simplifier(chunk, max_length=100, min_length=30, do_sample=False)[0]['summary_text']
                simplified_chunks.append(summary)
        
        # Combine the summaries
        return " ".join(simplified_chunks)
    except Exception as e:
        print(f"Error in simplification: {str(e)}")
        return clause

def generate_report(query, k=3):
    """
    Generate a final legal report for a given query:
      1. Retrieve the top k similar segments.
      2. Simplify each retrieved segment.
      3. Combine results into a report.
    """
    retrieved_segments = retrieve_similar_segments(query, k)
    report_lines = []
    report_lines.append("Final Legal Report for query: '{}'".format(query))
    report_lines.append("=" * 50)
    for idx, seg in enumerate(retrieved_segments, 1):
        simplified = simplify_clause(seg)
        report_lines.append(f"\nClause {idx}:\n{simplified}\n")
    final_report = "\n".join(report_lines)
    return final_report

# --------------------------
# Step 4: FastAPI Integration
# --------------------------

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class QueryRequest(BaseModel):
    query: str
    k: int = 3

@app.post("/report")
async def get_report(request: QueryRequest):
    try:
        report = generate_report(request.query, request.k)
        return {"report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def read_root():
    return {"message": "ClauseSense API. POST a query to /report to get a legal report."}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)