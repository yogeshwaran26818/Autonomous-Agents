from database import get_collection
from schemas import ConversationMemory
from datetime import datetime
import uuid

def get_session(session_id: str, username: str) -> dict:
    collection = get_collection("conversations")
    return collection.find_one({"session_id": session_id, "username": username})

def get_all_sessions(username: str) -> list:
    collection = get_collection("conversations")
    cursor = collection.find({"username": username}).sort("updated_at", -1)
    sessions = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        sessions.append(doc)
    return sessions

def create_session(username: str, initial_request: str) -> str:
    collection = get_collection("conversations")
    session_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    session_data = {
        "session_id": session_id,
        "username": username,
        "history": [{"role": "user", "message": initial_request, "timestamp": now}],
        "context": "",
        "execution_plan": [],
        "generated_documents": [],
        "created_at": now,
        "updated_at": now
    }
    
    collection.insert_one(session_data)
    return session_id

def update_session(session_id: str, username: str, update_data: dict):
    collection = get_collection("conversations")
    update_data["updated_at"] = datetime.utcnow()
    collection.update_one(
        {"session_id": session_id, "username": username},
        {"$set": update_data}
    )

def add_message(session_id: str, username: str, role: str, message: str):
    collection = get_collection("conversations")
    msg = {
        "role": role,
        "message": message,
        "timestamp": datetime.utcnow()
    }
    collection.update_one(
        {"session_id": session_id, "username": username},
        {
            "$push": {"history": msg},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
