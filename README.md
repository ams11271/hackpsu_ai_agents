# Hack PSU - ClauseSense

A legal document analysis and summarization tool that uses AI to process and analyze legal documents, making them more accessible and easier to understand.

## Overview

ClauseSense is an AI-powered tool that:
- Processes legal documents (DOCX files) and extracts key clauses
- Uses semantic search to find relevant sections based on user queries
- Generates concise summaries of legal clauses (limited to 4 sentences for clarity)
- Provides a user-friendly web interface for document analysis.

## Technical Details

### AI/ML Components

1. **Text Summarization**
   - Uses T5-small model from Hugging Face Transformers
   - Generates concise summaries limited to 4 sentences
   - Optimized for legal document context

2. **Semantic Search**
   - Implements FAISS (Facebook AI Similarity Search) for efficient similarity search
   - Uses Sentence Transformers (all-MiniLM-L6-v2) for text embeddings
   - Enables natural language queries to find relevant legal clauses

3. **Document Processing**
   - Automatic text extraction from DOCX files
   - Smart segmentation using legal document markers (WHEREAS, Section, Definitions, etc.)
   - Efficient text chunking for processing large documents

### Key Technologies
- FastAPI for backend server
- Sentence Transformers for text embeddings
- FAISS for vector similarity search
- T5-small for text summarization
- Python-docx for document processing

## Setup

1. Clone the repository
2. Create a conda environment and install dependencies:
```bash
conda create -n legal_rag_fresh python=3.10
conda activate legal_rag_fresh
pip install -r requirements.txt
```

3. Place your legal documents (DOCX files) in the `data` directory

## Running the Application

1. Start the backend server:
```bash
python app.py
```

2. Open `index.html` in your web browser to access the user interface

## Project Structure

- `app.py`: FastAPI backend server
- `vectorize.py`: Document processing and semantic search implementation
- `index.html`: Web interface
- `data/`: Directory for storing legal documents (DOCX files)
