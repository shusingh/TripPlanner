from fastapi import FastAPI
from pydantic import BaseModel
from transformers import T5Tokenizer, T5ForConditionalGeneration, logging as hf_logging
import torch

# Silence unnecessary HF logs
hf_logging.set_verbosity_error()

# 1) Load tokenizer & model
tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-small")
model     = T5ForConditionalGeneration.from_pretrained("google/flan-t5-small")

app = FastAPI()

class InferenceRequest(BaseModel):
    inputs: str

class InferenceResponse(BaseModel):
    generated_text: str

@app.get("/")
async def health():
    return {"status": "ok"}

@app.post("/generate", response_model=InferenceResponse)
async def generate(payload: InferenceRequest):
    prompt = payload.inputs
    print(f"[generate] prompt={prompt!r}")

    # 2) Tokenize into input IDs
    inputs = tokenizer(prompt, return_tensors="pt")

    # (Optional) move to GPU if available
    if torch.cuda.is_available():
        inputs = {k: v.cuda() for k, v in inputs.items()}
        model.cuda()

    # 3) Generate with explicit max_length
    #    max_length = prompt_length + max_new_tokens
    max_new = 64
    prompt_len = inputs["input_ids"].shape[-1]
    outputs = model.generate(
        inputs["input_ids"],
        max_length=prompt_len + max_new,
        do_sample=True,
        temperature=0.7,
        top_p=0.9,
        eos_token_id=tokenizer.eos_token_id,
        pad_token_id=tokenizer.pad_token_id,
        num_return_sequences=1,
        early_stopping=True,
    )

    # 4) Decode, skipping all special tokens
    text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(f"[generate] raw_output={text!r}")

    return InferenceResponse(generated_text=text)
