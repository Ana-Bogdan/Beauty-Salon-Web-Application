import os
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from . import models
from .database import SessionLocal
from passlib.context import CryptContext
from datetime import datetime, timedelta

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Load SECRET_KEY from .env
SECRET_KEY = "supersecure_fixed_key_that_will_not_change"
ALGORITHM = "HS256"

print("AUTH SECRET_KEY:", SECRET_KEY)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=30)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Dependency to get DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Decode token and get user
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    print("🔐 RAW TOKEN RECEIVED:", token)
    print("🔐 USING SECRET KEY:", SECRET_KEY)
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("✅ DECODED PAYLOAD:", payload)
        user_id: int = payload.get("sub")
        if user_id is None:
            print("❌ Missing 'sub' in token payload")
            raise credentials_exception
    except JWTError as e:
        print("❌ JWT ERROR:", str(e))
        raise credentials_exception

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        print("❌ User not found in DB")
        raise credentials_exception
    print("✅ Authenticated user:", user.email)
    return user

