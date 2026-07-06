# Autonomous AI Agent Application

A full-stack, production-quality AI Agent application that autonomously processes user requests, generates execution plans, creates professional Word documents, and maintains session-based memory using MongoDB.

## Features

- **ChatGPT-Inspired UI**: Beautiful, light-themed responsive interface.
- **Autonomous Workflow**: The agent plans its tasks and executes them sequentially.
- **Document Generation**: Automatically formats and generates professional `.docx` documents.
- **Session Memory**: Uses MongoDB to remember context for iterative document improvements.
- **JWT Authentication**: Secure login flow.

## Tech Stack

- **Frontend**: React (Vite), Axios, Lucide React, Vanilla CSS.
- **Backend**: FastAPI, Pydantic, python-docx, PyMongo, python-jose (JWT).
- **LLM**: Groq API.
- **Database**: MongoDB Atlas.

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.11+)

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` directory.
2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn app:app --reload
   ```
   *The server will run on http://localhost:8000*
   *(The demo user `demo_user` with password `demo123` is automatically initialized on startup)*

### 2. Frontend Setup

1. Open another terminal and navigate to the `frontend` directory.
2. Install dependencies (already done if you ran this through the agent workspace):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will run on http://localhost:5173*

---

## Environment Variables

The backend relies on the `.env` file located in the `backend/` directory. The following variables are already configured:

```env
GROQ_API_KEY=<your_groq_api_key>
MONGODB_URI=<your_mongodb_uri>
DATABASE_NAME=autonomous_agent
SECRET_KEY=yoursecretkeyherechangeinprod
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Usage

1. Open the frontend in your browser.
2. Log in using the **Demo Credentials**:
   - **Username**: `demo_user`
   - **Password**: `demo123`
3. Enter a prompt like: *"Create a project proposal for an AI Resume Screening System"*
4. Watch the AI Agent plan its execution, generate the content, and provide a downloadable `.docx` file!
