from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from deep_translator import GoogleTranslator
from typing import List

router = APIRouter(tags=["Translation"])

class TranslationRequest(BaseModel):
    text: str
    target_lang: str

class TranslationResponse(BaseModel):
    translated_text: str

@router.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    if not request.text.strip():
        return TranslationResponse(translated_text="")
        
    try:
        translator = GoogleTranslator(source='auto', target=request.target_lang)
        
        # Split text by double newlines first to keep paragraphs intact
        paragraphs = request.text.split("\n\n")
        translated_paragraphs = []
        
        current_chunk = ""
        max_chunk_size = 3500 # Safer limit
        
        for p in paragraphs:
            if len(current_chunk) + len(p) < max_chunk_size:
                current_chunk += p + "\n\n"
            else:
                if current_chunk:
                    translated_paragraphs.append(translator.translate(current_chunk.strip()))
                current_chunk = p + "\n\n"
        
        if current_chunk:
            translated_paragraphs.append(translator.translate(current_chunk.strip()))
            
        translated_text = "\n\n".join(translated_paragraphs)
        return TranslationResponse(translated_text=translated_text)
    except Exception as e:
        print(f"Translation Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI Translation Service Error: {str(e)}")

@router.get("/languages")
async def get_supported_languages():
    # Returning a curated list of languages for our UI
    return {
        "languages": [
            {"code": "en", "label": "English"},
            {"code": "ur", "label": "Urdu"},
            {"code": "ar", "label": "Arabic"},
            {"code": "es", "label": "Spanish"},
            {"code": "fr", "label": "French"},
            {"code": "de", "label": "German"},
            {"code": "hi", "label": "Hindi"},
            {"code": "zh-CN", "label": "Chinese (Simplified)"},
            {"code": "ja", "label": "Japanese"},
        ]
    }
