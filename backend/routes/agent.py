from fastapi import APIRouter, Depends, HTTPException, status
from schemas import AgentRequest, AgentResponse
from auth.dependencies import get_current_user
from services.memory import get_session, create_session, add_message, update_session
from services.planner import generate_plan
from services.executor import execute_task

router = APIRouter()

@router.post("/agent", response_model=AgentResponse)
async def process_agent_request(req: AgentRequest, current_user: dict = Depends(get_current_user)):
    username = current_user["username"]
    
    if not req.request.strip():
        raise HTTPException(status_code=400, detail="Request cannot be empty")

    session_id = req.session_id
    context = ""
    
    if session_id:
        session = get_session(session_id, username)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        context = session.get("context", "")
        add_message(session_id, username, "user", req.request)
    else:
        session_id = create_session(username, req.request)
        
    # Generate Plan
    plan = generate_plan(req.request, context)
    
    # Update memory with pending plan
    update_session(session_id, username, {"execution_plan": plan})
    
    # Execute Task
    result = execute_task(req.request, plan, context, session_id, username)
    
    # Add agent response to history
    add_message(session_id, username, "assistant", result["response"])
    
    # Update session with final data
    update_data = {
        "context": result["updated_context"],
        "execution_plan": result["execution_plan"]
    }
    
    # If a document was generated, push to array
    if result["document_name"]:
        # We need to do a custom update to push the document, but for simplicity we will just append it
        session = get_session(session_id, username)
        docs = session.get("generated_documents", [])
        if result["document_name"] not in docs:
            docs.append(result["document_name"])
        update_data["generated_documents"] = docs
        
    update_session(session_id, username, update_data)
    
    return result
