# model-server/Dockerfile

FROM python:3.11-slim

# 1) Install OS packages needed by PyTorch (BLAS, OpenMP, compiler)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      libopenblas-dev \
      libomp-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2) Copy just requirements, install torch first (so it is cached separately)
COPY requirements.txt .

# Install PyTorch CPU wheel (no CUDA)
RUN pip install --no-cache-dir \
      torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# 3) Copy application code
COPY main.py .

# 4) Start the Uvicorn server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
