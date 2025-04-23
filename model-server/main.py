from fastapi import FastAPI
from pydantic import BaseModel
from transformers import (
    pipeline,
    T5Tokenizer,
    T5ForConditionalGeneration,
    logging as hf_logging,
)
import torch

# ─── Silence Transformers INFO/WARN logs ─────────────────────────────────────
hf_logging.set_verbosity_error()

# ─── Load model + tokenizer once ─────────────────────────────────────────────
tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-small")
model     = T5ForConditionalGeneration.from_pretrained("google/flan-t5-small")

# ─── Build a pipeline for text2text (handles decoder start tokens, etc.) ────
device = 0 if torch.cuda.is_available() else -1
generator = pipeline(
    "text2text-generation",
    model=model,
    tokenizer=tokenizer,
    device=device,
)

# ─── FastAPI setup ──────────────────────────────────────────────────────────
app = FastAPI()

class InferenceRequest(BaseModel):
    inputs: str

class InferenceResponse(BaseModel):
    generated_text: str

@app.get("/")
async def health():
    """Health check."""
    return {"status": "ok"}

@app.post("/generate", response_model=InferenceResponse)
async def generate(req: InferenceRequest):
    # Debug log: incoming prompt
    print(f"[generate] prompt={req.inputs!r}")

    # Run the pipeline
    outputs = generator(
        req.inputs,
        max_new_tokens=64,  # allow up to 64 new tokens
        do_sample=True,     # enable sampling so temperature/top_p matter
        temperature=0.7,
        top_p=0.9,
        num_return_sequences=1,
    )
    raw = outputs[0]["generated_text"]

    # Debug log: raw pipeline output
    print(f"[generate] raw_output={raw!r}")

    return InferenceResponse(generated_text=raw)
