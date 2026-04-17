# Nexus Ai 📚

> A production-ready, AI-powered book reading and learning platform.

**Stack:** Next.js 14+ · Tailwind CSS · Shadcn/UI · FastAPI · Supabase · Vercel · Render

---

## 📁 Project Structure

```
ai-book-platform/
├── frontend/          # Next.js 14 App Router (Vercel)
├── backend/           # Python FastAPI (Render / Railway)
├── database/          # Supabase SQL schema
└── .gitignore
```

---

## 🚀 Quick Start

### 1. Clone & Setup

```bash
git clone https://github.com/your-username/ai-book-platform.git
cd ai-book-platform
```

### 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `database/schema.sql`
3. Copy your **Project URL**, **Anon Key**, **Service Role Key**, and **JWT Secret** from Project Settings → API

### 3. Frontend Setup

```bash
cd frontend
cp .env.local.example .env.local
# Fill in your Supabase values in .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your Supabase values in .env

python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API runs at [http://localhost:8000](http://localhost:8000)

---

## 🔐 Environment Variables

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_API_URL` | Backend API URL (for production) |

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `SUPABASE_JWT_SECRET` | JWT secret from Supabase settings |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `DEBUG` | Set `true` to enable API docs |

---

## 🚢 Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Update `vercel.json` → replace `your-backend.onrender.com` with your real backend URL
5. Deploy — done!

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo, set **Root Directory** to `backend`
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `backend/.env.example`
6. Deploy!

Alternatively, use the **Dockerfile** for Docker-based deployments on Railway or Fly.io:

```bash
docker build -t ai-book-backend ./backend
docker run -p 8000:8000 --env-file backend/.env ai-book-backend
```

---

## 🔌 API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ❌ | Root info |
| `GET` | `/api/v1/health-check` | ✅ JWT | Health check + DB ping |
| `GET` | `/docs` | ❌ (debug only) | Swagger UI |

**Testing the protected endpoint:**
```bash
# Get your JWT from Supabase after login, then:
curl -H "Authorization: Bearer YOUR_JWT" \
     http://localhost:8000/api/v1/health-check
```

---

## 🗄️ Database Schema

```
auth.users           (Supabase built-in)
  └── profiles       (theme, full_name, avatar_url)
      └── user_progress (book_id, chapter_id, progress_pct)
```

- **RLS enabled** on all tables — users only access their own data
- **Auto-trigger** creates a profile row on every new signup

---

## 🎨 Features — Phase 1

- ✅ Supabase Auth (Login / Signup / Logout)
- ✅ Protected routes via Next.js middleware
- ✅ Dark / Light / System theme toggle (saved to DB)
- ✅ Sticky collapsible sidebar
- ✅ Sticky top navigation with search + user avatar
- ✅ Dashboard with stats, book progress cards, activity chart
- ✅ Professional landing page
- ✅ FastAPI backend with JWT-protected health-check
- ✅ Dockerfile (multi-stage, non-root user)
- ✅ Vercel deployment config with security headers

---

## 📜 License

MIT
