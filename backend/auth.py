import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
import os
from sqlalchemy.orm import Session
from database import get_db
from models import Staff

security = HTTPBearer()
load_dotenv()

def get_current_user(credentials : HTTPAuthorizationCredentials = Depends(security), db:Session = Depends(get_db)):
  token = credentials.credentials
  SECRET_KEY = os.environ["SECRET_KEY"]
  ENC_ALGORITHM = ["HS256"]

  try:
    decoded_token = jwt.decode(token, SECRET_KEY, algorithms=ENC_ALGORITHM)
    user_id = int(decoded_token["sub"])
  except (jwt.InvalidTokenError, KeyError, ValueError, TypeError):

    raise HTTPException (status_code=401, detail="Invalid Token")

  
  user = db.query(Staff).filter(Staff.id == user_id).first()
  if not user:
    raise HTTPException (status_code=401, detail="User Not Found")
  return user