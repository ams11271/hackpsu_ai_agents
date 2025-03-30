from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import chatbot

app = FastAPI(
    title="License Agreement Generator API",
    description="API for generating and managing license agreements",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chatbot.router, prefix="/api/v1/chatbot", tags=["chatbot"])

@app.get("/")
async def root():
    return {"message": "Welcome to the License Agreement Generator API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 