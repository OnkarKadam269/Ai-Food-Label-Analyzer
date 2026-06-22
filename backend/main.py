import os
import json
import base64
import requests
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IngredientInfo(BaseModel):
    name: str
    simple_explanation: str

class AnalysisResult(BaseModel):
    score: int
    frequency_recommendation: str
    harmful_ingredients: List[IngredientInfo]
    good_ingredients: List[IngredientInfo]
    other_ingredients: List[IngredientInfo]
    reasoning: str = ""

def analyze_image_with_gemini(image_bytes: bytes, mime_type: str) -> str:
    # Use REST API directly
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set. Please set it to use the analyzer.")
    
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent"
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": api_key
    }
    
    image_b64 = base64.b64encode(image_bytes).decode('utf-8')
    
    prompt = """
    You are an expert AI food label analyzer and nutritionist. Analyze the provided image of a food label's ingredients list.
    Extract the ingredients, evaluate the health risks, calculate an automated Health Score (0-100), and provide recommendations.
    
    Output your response as a strict JSON object with exactly the following structure:
    {
      "score": <integer from 0 to 100 representing healthiness>,
      "frequency_recommendation": "<a simple string like 'Once a week', 'Daily', 'Rarely'>",
      "harmful_ingredients": [{"name": "<ingredient>", "simple_explanation": "<why it's harmful in simple terms>"}],
      "good_ingredients": [{"name": "<ingredient>", "simple_explanation": "<why it's good in simple terms>"}],
      "other_ingredients": [{"name": "<ingredient>", "simple_explanation": "<neutral explanation>"}],
      "reasoning": "<brief overall summary of why this score was given>"
    }
    
    Do NOT wrap the JSON in markdown formatting (like ```json ... ```). Output ONLY the raw JSON string.
    Ensure you categorize every major ingredient you can identify.
    """
    
    data = {
        "contents": [
            {
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": image_b64
                        }
                    }
                ]
            }
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code != 200:
            print(f"Gemini API Error: {response.status_code} - {response.text}")
            raise ValueError(f"API Error {response.status_code}: {response.text}")
            
        response_data = response.json()
        try:
            text = response_data['candidates'][0]['content']['parts'][0]['text']
            return text
        except (KeyError, IndexError) as e:
            print(f"Unexpected response format: {response_data}")
            raise ValueError("Failed to parse response from Gemini API.")
    except requests.exceptions.RequestException as e:
        print(f"Network error calling Gemini API: {e}")
        raise ValueError(f"Network error calling Gemini API: {e}")

@app.post("/analyze")
async def analyze_label(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        mime_type = image.content_type or "image/jpeg"
        
        # Call Gemini Vision to extract and analyze
        json_response = analyze_image_with_gemini(contents, mime_type)
        
        # Clean up potential markdown formatting just in case
        clean_json = json_response.strip()
        if clean_json.startswith("```json"):
            clean_json = clean_json[7:]
        if clean_json.endswith("```"):
            clean_json = clean_json[:-3]
            
        data = json.loads(clean_json.strip())
        return data
        
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        print(f"Raw Response: {json_response}")
        raise HTTPException(status_code=500, detail="Failed to parse AI response into JSON format.")
    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "AI Food Label Analyzer API is running."}
