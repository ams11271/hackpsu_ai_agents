# agents.py
# This script integrates a summarization (simplifier) agent into the RAG pipeline.
# It assumes that the following objects from Step 2 are already defined:
#    - segments: a list of text segments from your DOCX documents.
#    - retrieve_similar_segments(query, k): a function that returns the top k similar segments for a query.
#
# If these are in a separate module (e.g., vectorize_single.py), you can import them:
from vectorize import segments, retrieve_similar_segments

from transformers import pipeline
import textwrap

# Initialize the summarization pipeline using an open-source model (T5-small)
simplifier = pipeline("summarization", model="t5-small", tokenizer="t5-small")

def chunk_text(text, max_length=500):
    """Split text into chunks of max_length words."""
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    
    for word in words:
        if current_length + len(word.split()) > max_length:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_length = len(word.split())
        else:
            current_chunk.append(word)
            current_length += len(word.split())
    
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    
    return chunks

def simplify_clause(clause, max_length=100):
    """
    Simplify a legal clause using the summarization pipeline.
    If the clause is too short, return it unchanged.
    For long clauses, chunk them and summarize each chunk.
    """
    # Check if the clause is long enough to summarize
    if len(clause.split()) < 20:
        return clause
    
    try:
        # Split long text into chunks
        chunks = chunk_text(clause)
        summaries = []
        
        for chunk in chunks:
            summary = simplifier(chunk, max_length=max_length, min_length=30, do_sample=False)
            summaries.append(summary[0]['summary_text'])
        
        # Combine summaries
        final_summary = " ".join(summaries)
        return final_summary
    except Exception as e:
        print("Simplification error:", e)
        return clause

def generate_report(query, k=3):
    """
    Generate a final legal report for a given query by:
      1. Retrieving the top k similar segments using your FAISS-based RAG.
      2. Simplifying each segment using the summarization agent.
      3. Combining the results into a final report.
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

if __name__ == "__main__":
    # Example usage:
    query = "What are the key terms regarding investor rights and obligations?"
    report = generate_report(query, k=3)
    print(report)