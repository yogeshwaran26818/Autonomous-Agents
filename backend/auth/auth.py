from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from schemas import Token, UserLogin, UserRegister, User
from auth.security import verify_password, get_password_hash
from auth.jwt_handler import create_access_token
from database import get_collection
from config import settings

router = APIRouter()

@router.post("/register", response_model=User)
async def register_user(form_data: UserRegister):
    users_collection = get_collection("users")
    
    # Check if user already exists
    if users_collection.find_one({"username": form_data.username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    if users_collection.find_one({"email": form_data.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    new_user = {
        "username": form_data.username,
        "email": form_data.email,
        "full_name": form_data.username,
        "hashed_password": get_password_hash(form_data.password),
        "disabled": False
    }
    
    users_collection.insert_one(new_user)
    
    return {
        "username": new_user["username"],
        "email": new_user["email"],
        "full_name": new_user["full_name"],
        "disabled": new_user["disabled"]
    }

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: UserLogin):
    users_collection = get_collection("users")
    user = users_collection.find_one({"username": form_data.username})
    
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
