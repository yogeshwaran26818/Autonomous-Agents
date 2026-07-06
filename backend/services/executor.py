from services.groq_client import generate_completion
from services.document_generator import generate_docx
from services.memory import update_session

def execute_task(request: str, plan: list, context: str, session_id: str, username: str) -> dict:
    # 1. Understand Request
    plan[0]["status"] = "Completed"
    
    # 2. Retrieve Conversation Memory
    plan[1]["status"] = "Completed"
    
    # 3. Generate Plan
    plan[2]["status"] = "Completed"
    
    # 4. Execute Tasks (Generate content)
    plan[3]["status"] = "Running"
    
    system_prompt = """You are an expert business and technical document writer. 
Based on the user request and context, generate the content for a professional document.
Use markdown formatting (# for title, ## for sections, - for bullets, 1. for numbered lists).
Do not include any chat-like introductory or concluding remarks, only output the document content itself."""
    
    prompt = f"Context: {context}\n\nUser Request: {request}\n\nPlease generate the comprehensive document."
    document_content = generate_completion(prompt, system_prompt)
    
    plan[3]["status"] = "Completed"
    
    # 5. Generate Document (docx)
    plan[4]["status"] = "Running"
    document_name = generate_docx(document_content)
    plan[4]["status"] = "Completed"
    
    # 6. Save Memory
    plan[5]["status"] = "Running"
    
    # Extract brief response text
    response_prompt = f"Summarize what you just did for the user in 2 sentences based on this request: {request}"
    response_text = generate_completion(response_prompt, "You are a helpful AI assistant.")
    
    # Save to DB
    new_context = context + f"\nUser requested: {request}\nAgent generated document: {document_name}\n"
    
    update_data = {
        "context": new_context,
        "execution_plan": plan,
    }
    # update_session handled in route or memory.py, but we update the dictionary here for the route to use
    
    plan[5]["status"] = "Completed"
    
    return {
        "status": "success",
        "session_id": session_id,
        "execution_plan": plan,
        "document_name": document_name,
        "download_url": f"/document/{document_name}",
        "response": response_text,
        "updated_context": new_context
    }
