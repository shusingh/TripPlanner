# model-server/main.py

from fastapi import FastAPI, Request
from pydantic import BaseModel
from transformers import T5Tokenizer, T5ForConditionalGeneration, logging as hf_logging
import torch

# Silence excessive transformers logging
hf_logging.set_verbosity_error()

# 1. Load model and tokenizer once at startup
tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-small")
model     = T5ForConditionalGeneration.from_pretrained("google/flan-t5-small")

app = FastAPI()

class InferenceRequest(BaseModel):
    inputs: str

class InferenceResponse(BaseModel):
    generated_text: str

@app.get("/")
async def health():
    """Simple health check."""
    return {"status": "ok"}

@app.post("/generate", response_model=InferenceResponse)
async def generate(req: InferenceRequest, request: Request):
    # DEBUG: log incoming prompt
    print(f"[generate] inputs={req.inputs!r}")

    # Tokenize the prompt
    inputs = tokenizer(req.inputs, return_tensors="pt")

    # Move tensors to CPU/GPU if needed
    if torch.cuda.is_available():
        inputs = {k: v.cuda() for k, v in inputs.items()}
        model.cuda()

    # 2. Generate tokens using sampling so we actually get output
    outputs = model.generate(
        inputs["input_ids"],
        max_new_tokens=64,   # allow up to 64 new tokens
        do_sample=True,      # turn on sampling
        temperature=0.7,     # control randomness
        top_p=0.9,           # nucleus sampling
        num_return_sequences=1,
    )

    # DEBUG: log raw token IDs
    print(f"[generate] token_ids={outputs[0].tolist()}")

    # 3. Decode to text, stripping special tokens
    text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # DEBUG: log the raw generated text
    print(f"[generate] output={text!r}")

    return InferenceResponse(generated_text=text)
