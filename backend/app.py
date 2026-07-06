from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_to_mongo, close_mongo_connection, get_collection
from auth.security import get_password_hash
from routes import agent, history, document, health
from auth import auth
import os

app = FastAPI(title="Autonomous AI Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    connect_to_mongo()
    
    # Initialize demo user
    try:
        users = get_collection("users")
        demo_user = users.find_one({"username": "demo_user"})
        if not demo_user:
            users.insert_one({
                "username": "demo_user",
                "hashed_password": get_password_hash("demo123"),
                "email": "demo@example.com",
                "full_name": "Demo User",
                "disabled": False
            })
            print("Demo user initialized.")
    except Exception as e:
        print(f"Error initializing demo user: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    close_mongo_connection()

app.include_router(auth.router, tags=["Authentication"])
app.include_router(agent.router, tags=["Agent"])
app.include_router(history.router, tags=["History"])
app.include_router(document.router, tags=["Documents"])
app.include_router(health.router, tags=["Health"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
