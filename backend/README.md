# Voltix Backend API

Production-ready backend API service for **Voltix**, built using FastAPI, PostgreSQL, Supabase Auth, Redis, and Async Python following Clean Architecture, Repository Pattern, and Dependency Injection principles.

---

## 🛠️ Architecture & Ownership Boundaries

All backend code and configurations strictly reside within `backend/`:

```
backend/
├── alembic.ini                  # Alembic DB migration configuration
├── app/
│   ├── api/                     # REST API routers & versioned endpoints
│   ├── core/                    # Core configs, Security (JWT/Bcrypt), DB & Redis connections
│   ├── domain/                  # Pydantic schemas, interfaces & domain logic
│   ├── infrastructure/          # SQLAlchemy DB models & Repository implementations
│   └── main.py                  # FastAPI application entrypoint
├── config/                      # Environment variables (.env.example)
├── database/                    # Raw database scripts & SQL dumps
├── docker/                      # Dockerfile & Docker Compose services
├── infra/                       # Infrastructure & deployment manifests
├── migrations/                  # Alembic async database migration scripts
├── requirements.txt             # Python dependencies
└── supabase/                    # Supabase integration assets & local configs
```

---

## 📋 Prerequisites

- **Python 3.11+**
- **PostgreSQL 16+** (or Supabase Postgres instance)
- **Redis 7+**
- **Docker & Docker Compose** (Optional, for containerized run)

---

## ⚙️ Environment Setup

1. Copy the example environment configuration:
   ```bash
   cp backend/config/.env.example backend/.env
   ```

2. Configure your database, Redis, and Supabase secrets inside `backend/.env`:
   ```env
   PROJECT_NAME="Voltix Backend API"
   ENVIRONMENT="development"
   DEBUG=True

   # Postgres Database
   DATABASE_URL="postgresql+asyncpg://postgres:postgres_password@localhost:5432/voltix_db"

   # Redis Cache
   REDIS_URL="redis://localhost:6379/0"

   # Supabase Auth Setup
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_JWT_SECRET="your-supabase-jwt-secret"
   ```

---

## 🚀 Run Commands

### Option A: Local Development (Python Virtual Environment)

1. **Navigate to project workspace root:**
   ```bash
   cd c:\Users\pravi\Downloads\Voltix
   ```

2. **Create & activate a Python virtual environment:**
   - **Windows (PowerShell):**
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS:**
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. **Install backend dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Run Database Migrations:**
   ```bash
   alembic -c backend/alembic.ini upgrade head
   ```

5. **Start the FastAPI Development Server:**
   ```bash
   uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
   ```

---

### Option B: Docker Compose (PostgreSQL + Redis + FastAPI)

1. **Start all services in detached mode:**
   ```bash
   docker-compose -f backend/docker/docker-compose.yml up -d --build
   ```

2. **View running logs:**
   ```bash
   docker-compose -f backend/docker/docker-compose.yml logs -f api
   ```

3. **Stop container services:**
   ```bash
   docker-compose -f backend/docker/docker-compose.yml down
   ```

---

## 🌐 Interactive API Documentation

Once the server is running, explore and test interactive endpoints at:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check:** `GET http://localhost:8000/api/v1/health`


---

## 🔑 Available API Endpoints (Phase 1)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health Check & System Status | No |
| `POST` | `/api/v1/auth/register` | Register new user profile | No |
| `POST` | `/api/v1/auth/login` | Local OAuth2 password login | No |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile | **Yes (Bearer JWT)** |
| `POST` | `/api/v1/auth/verify-supabase` | Validate Supabase Auth token & sync profile | No |
