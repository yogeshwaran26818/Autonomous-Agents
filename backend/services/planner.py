import json
from services.groq_client import generate_completion

def generate_plan(request: str, context: str = "") -> list:
    system_prompt = """You are an AI planner. 
Your job is to take a user request and any existing context, and break it down into an execution plan.
The plan should be a sequence of steps. Each step must have a 'step_number' and a 'description'.
Always start with:
1. Understand Request
2. Retrieve Conversation Memory
3. Generate Plan
4. Execute Tasks
5. Generate Document
6. Save Memory

You must return ONLY a JSON array of objects, with no other text, no markdown block quotes.
Example:
[
  {"step_number": 1, "description": "Understand Request", "status": "Completed"},
  {"step_number": 2, "description": "Retrieve Conversation Memory", "status": "Completed"},
  {"step_number": 3, "description": "Generate Plan", "status": "Completed"},
  {"step_number": 4, "description": "Execute Tasks (Generate document sections)", "status": "Pending"},
  {"step_number": 5, "description": "Generate Document", "status": "Pending"},
  {"step_number": 6, "description": "Save Memory", "status": "Pending"}
]
"""
    prompt = f"Context: {context}\nUser Request: {request}\n\nGenerate the execution plan JSON:"
    
    response_text = generate_completion(prompt, system_prompt)
    try:
        # Clean up in case the LLM returned markdown code blocks
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
            
        plan = json.loads(response_text)
        return plan
    except Exception as e:
        print(f"Failed to parse plan: {response_text}, Error: {e}")
        # Fallback plan
        return [
            {"step_number": 1, "description": "Understand Request", "status": "Completed"},
            {"step_number": 2, "description": "Retrieve Conversation Memory", "status": "Completed"},
            {"step_number": 3, "description": "Generate Plan", "status": "Completed"},
            {"step_number": 4, "description": "Execute Tasks", "status": "Pending"},
            {"step_number": 5, "description": "Generate Document", "status": "Pending"},
            {"step_number": 6, "description": "Save Memory", "status": "Pending"}
        ]
