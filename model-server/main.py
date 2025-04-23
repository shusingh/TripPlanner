from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

generator = pipeline(
    "text2text-generation",
    model="google/flan-t5-small",  # or your chosen small model
    device=-1  # CPU
)

app = FastAPI()

class InferenceRequest(BaseModel):
    inputs: str

class InferenceResponse(BaseModel):
    generated_text: str

@app.post("/generate", response_model=InferenceResponse)
def generate(req: InferenceRequest):
    # 1. Run inference without return_full_text
    result = generator(
        req.inputs,
        max_new_tokens=2000,
        do_sample=True,
        temperature=0.7
    )
    return InferenceResponse(generated_text=result[0]["generated_text"])
