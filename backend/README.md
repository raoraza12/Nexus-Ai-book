# FastAPI Backend — AI Book Platform

## Running Locally

```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Copy and fill in environment variables
cp .env.example .env

# Start development server (auto-reload)
uvicorn app.main:app --reload --port 8000
```

- **API:** http://localhost:8000  
- **Swagger UI** (debug mode): http://localhost:8000/docs  
- **ReDoc** (debug mode): http://localhost:8000/redoc  

## Docker

```bash
# Build
docker build -t ai-book-backend .

# Run
docker run -p 8000:8000 --env-file .env ai-book-backend
```

## Deploy to Render

1. Create Web Service → connect GitHub
2. Root Directory: `backend`
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add env vars from `.env.example`
