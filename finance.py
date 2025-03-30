from docx import Document
import re

def extract_text_from_docx(file_path):
    doc = Document(file_path)
    full_text = []
    for para in doc.paragraphs:
        # Simple cleaning: strip extra whitespace
        text = para.text.strip()
        if text:
            full_text.append(text)
    return "\n".join(full_text)

def segment_text(text):
    # Example segmentation: split text on common legal markers like "WHEREAS" or "Section"
    segments = re.split(r'\n(?=WHEREAS|Section|Definitions|RECITALS)', text, flags=re.IGNORECASE)
    return [seg.strip() for seg in segments if seg.strip()]

# Example usage:
file_path = r'/Users/arya/Downloads/Model-VA-10-24-2024.docx'

raw_text = extract_text_from_docx(file_path)
chunks = segment_text(raw_text)

print("Extracted", len(chunks), "segments")
for i, chunk in enumerate(chunks[:3]):
    print(f"Segment {i+1}:", chunk[:200], "...\n")
