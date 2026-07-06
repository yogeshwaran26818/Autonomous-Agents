from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any, Dict
from datetime import datetime

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class User(BaseModel):
    username: str
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

# Agent Task Schemas
class AgentRequest(BaseModel):
    request: str
    session_id: Optional[str] = None

class ExecutionPlanStep(BaseModel):
    step_number: int
    description: str
    status: str = "Pending" # Pending, Running, Completed, Failed

class AgentResponse(BaseModel):
    status: str
    session_id: str
    execution_plan: List[Dict[str, Any]]
    document_name: Optional[str] = None
    download_url: Optional[str] = None
    response: str

# Database Models mapped for PyMongo
class ChatMessage(BaseModel):
    role: str
    message: str
    timestamp: datetime

class ConversationMemory(BaseModel):
    session_id: str
    username: str
    history: List[ChatMessage]
    context: str = ""
    execution_plan: List[Dict[str, Any]] = []
    generated_documents: List[str] = []
    created_at: datetime
    updated_at: datetime
