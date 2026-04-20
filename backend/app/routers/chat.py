from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.config import get_settings, Settings
import openai
from openai import AsyncOpenAI
import logging

router = APIRouter(prefix="/chat", tags=["AI Agent"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    book_id: Optional[str] = None

@router.post("")
async def chat_with_agent(
    request: ChatRequest,
    settings: Settings = Depends(get_settings)
):
    """
    AI Agent Chat Endpoint.
    Uses OpenAI (or compatible API) to discuss book content.
    """
    if not settings.openai_api_key or len(settings.openai_api_key) < 10:
        return {
            "role": "assistant", 
            "content": "To engage with Nexus Intelligence, please provide a valid `OPENAI_API_KEY` in the system environment variables."
        }

    client = openai.AsyncOpenAI(api_key=settings.openai_api_key)

    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": m.role, "content": m.content} for m in request.messages],
            max_tokens=500,
        )
        return {"role": "assistant", "content": response.choices[0].message.content}
    except openai.AuthenticationError:
        logging.error("OpenAI Authentication Error - Invalid API Key")
        return {"role": "assistant", "content": "System Error: The provided OpenAI API key is invalid or unauthorized."}
    except openai.RateLimitError:
        logging.error("OpenAI Rate Limit Error")
        return {"role": "assistant", "content": "System Warning: Neural link overloaded (Rate Limit Exceeded). Please try again later."}
    except Exception as e:
        error_msg = str(e)
        logging.error(f"Chat API Exception: {error_msg}")
        return {"role": "assistant", "content": f"Critical Error interacting with Nexus Brain: {error_msg}"}
