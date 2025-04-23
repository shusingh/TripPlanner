from fastapi import FastAPI, Request
from pydantic import BaseModel
from transformers import T5Tokenizer, T5ForConditionalGeneration

# 1. Load model & tokenizer
tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-small")
model     = T5ForConditionalGeneration.from_pretrained("google/flan-t5-small")

app = FastAPI()

class InferenceRequest(BaseModel):
    inputs: str

class InferenceResponse(BaseModel):
    generated_text: str

@app.post("/generate", response_model=InferenceResponse)
async def generate(req: InferenceRequest, request: Request):
    # DEBUG: log incoming prompt
    print(f"[generate] inputs={req.inputs!r}")

    # Tokenize
    inputs = tokenizer(req.inputs, return_tensors="pt")

    # Generate using max_new_tokens
    outputs = model.generate(
        inputs.input_ids,
        max_new_tokens=64,   # only generate up to 64 new tokens
        do_sample=False      # deterministic; should at least echo
    )

    # Decode
    text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # DEBUG: log raw output
    print(f"[generate] output={text!r}")

    return InferenceResponse(generated_text=text)
