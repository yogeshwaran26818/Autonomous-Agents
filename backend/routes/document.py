from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from auth.dependencies import get_current_user
import os

router = APIRouter()

@router.get("/document/{document_name}")
async def get_document(document_name: str, current_user: dict = Depends(get_current_user)):
    # Validate filename to prevent path traversal
    if ".." in document_name or "/" in document_name or "\\" in document_name:
        raise HTTPException(status_code=400, detail="Invalid document name")
        
    docs_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "generated_docs")
    filepath = os.path.join(docs_dir, document_name)
    
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Document not found")
        
    return FileResponse(path=filepath, filename=document_name, media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
