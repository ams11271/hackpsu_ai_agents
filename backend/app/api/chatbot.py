from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
import requests
import os
from typing import List, Optional

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    user_info: dict = {}

class ChatResponse(BaseModel):
    license_text: str
    messages: List[ChatMessage]

@router.post("/generate", response_model=ChatResponse)
async def generate_license(request: ChatRequest):
    try:
        # Prepare the conversation with any user info
        messages = request.messages
        
        # Add user info to the system message if provided
        if request.user_info and len(messages) > 0 and messages[0].role == "system":
            user_info_str = ", ".join([f"{k}: {v}" for k, v in request.user_info.items()])
            messages[0].content += f"\n\nUser information: {user_info_str}"

        # Make request to OpenAI API
        api_key = os.getenv("OPENAI_API_KEY", "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")
        
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4-turbo",
                "messages": [{"role": m.role, "content": m.content} for m in messages],
                "temperature": 0.7
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        
        response_data = response.json()
        assistant_message = response_data["choices"][0]["message"]
        
        # Return the license text and updated conversation
        messages.append(ChatMessage(role=assistant_message["role"], content=assistant_message["content"]))
        
        return {
            "license_text": assistant_message["content"],
            "messages": messages
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 