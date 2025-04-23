from fastapi import FastAPI
from pydantic import BaseModel
from transformers import T5Tokenizer, T5ForConditionalGeneration

# 1. Load model and tokenizer once at startup
tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-small")
model     = T5ForConditionalGeneration.from_pretrained("google/flan-t5-small")

app = FastAPI()

class InferenceRequest(BaseModel):
    inputs: str

class InferenceResponse(BaseModel):
    generated_text: str

@app.post("/generate", response_model=InferenceResponse)
def generate(req: InferenceRequest):
    # 2. Tokenize the prompt
    inputs = tokenizer(req.inputs, return_tensors="pt")

    # 3. Generate output (on CPU)
    outputs = model.generate(
        inputs.input_ids,
        max_length=512,      # total tokens (prompt + generated)
        do_sample=True,      # enable sampling
        temperature=0.7,     # sampling temperature
        top_p=0.9,           # nucleus sampling
        num_return_sequences=1,
    )

    # 4. Decode and return
    text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return InferenceResponse(generated_text=text)
