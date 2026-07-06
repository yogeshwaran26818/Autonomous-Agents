from fastapi import APIRouter, Depends, HTTPException
from auth.dependencies import get_current_user
from services.memory import get_session, get_all_sessions

router = APIRouter()

@router.get("/history", response_model=list)
async def get_history_all(current_user: dict = Depends(get_current_user)):
    return get_all_sessions(current_user["username"])

@router.get("/history/{session_id}")
async def get_history_session(session_id: str, current_user: dict = Depends(get_current_user)):
    session = get_session(session_id, current_user["username"])
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    # Convert _id to string if needed
    session["_id"] = str(session["_id"])
    return session
