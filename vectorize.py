from docx import Document
import re
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

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
    Segment text into chunks using common legal document markers.
    Adjust the regex if necessary for your document's structure.
    """
    segments = re.split(r'\n(?=WHEREAS|Section|Definitions|RECITALS|AMENDED)', text, flags=re.IGNORECASE)
    return [seg.strip() for seg in segments if seg.strip()]

# Extract and segment text from the file
text = extract_text_from_docx(file_path)
segments = segment_text(text)
print(f"Total segments extracted: {len(segments)}")

# Initialize the embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Convert segments to embeddings (dense vectors)
embeddings = model.encode(segments, convert_to_numpy=True)

# Build a FAISS index using L2 (Euclidean) distance
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

def retrieve_similar_segments(query, k=3):
    """Given a query, retrieve the top k most similar segments."""
    query_vec = model.encode([query], convert_to_numpy=True)
    distances, indices = index.search(query_vec, k)
    results = [segments[i] for i in indices[0]]
    return results

# Example usage
if __name__ == "__main__":
    query = "What are the key investor terms?"
    top_segments = retrieve_similar_segments(query, k=3)
    print("\nTop similar segments:")
    for i, seg in enumerate(top_segments, 1):
        print(f"Segment {i}: {seg[:200]}...\n")  # prints first 200 characters for brevity
