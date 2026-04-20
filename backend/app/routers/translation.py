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

@router.post("/translate")
@router.post("/translate/")
async def translate_text(request: TranslationRequest):
    if not request.text.strip():
        return TranslationResponse(translated_text="")
        
    try:
        translator = GoogleTranslator(source='auto', target=request.target_lang)
        
        # Split text by double newlines first to keep paragraphs intact
        paragraphs = request.text.split("\n\n")
        translated_paragraphs = []
        
        max_chunk_size = 3000 # More conservative limit for stability
        
        for p in paragraphs:
            # If a single paragraph is too large, split it further by single newlines or sentences
            if len(p) > max_chunk_size:
                sub_chunks = []
                words = p.split(' ')
                current_sub = ""
                for word in words:
                    if len(current_sub) + len(word) < max_chunk_size:
                        current_sub += word + " "
                    else:
                        sub_chunks.append(current_sub.strip())
                        current_sub = word + " "
                if current_sub:
                    sub_chunks.append(current_sub.strip())
                
                translated_sub = [translator.translate(sc) for sc in sub_chunks if sc.strip()]
                translated_paragraphs.append(" ".join(translated_sub))
            else:
                if p.strip():
                    translated_paragraphs.append(translator.translate(p.strip()))
            
        translated_text = "\n\n".join(translated_paragraphs)
        return TranslationResponse(translated_text=translated_text)
    except Exception as e:
        error_msg = f"Neural Translation Error: {str(e)}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

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
