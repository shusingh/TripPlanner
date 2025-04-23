# model-server/Dockerfile

# 1. Start from a slim Python base
FROM python:3.11-slim

# 2. Install OS deps for PyTorch (OpenBLAS, OpenMP, compiler)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      libopenblas-dev \
      libomp-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3. Copy & install Python dependencies
COPY requirements.txt .

# Install CPU-only PyTorch first, then your other requirements
RUN pip install --no-cache-dir \
      torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# 4. Copy application code
COPY main.py .

# 5. Run the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
