from datetime import datetime, timedelta, timezone
import hashlib
import token

from fastapi import Body, FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas import StaffSignUp, StaffLogin, ResetPasswordRequest
from database import get_db
from models import Staff, PasswordResetToken
from security import create_reset_password_token, hash_password, check_password, create_access_token
from auth import get_current_user
from fastapi.middleware.cors import CORSMiddleware
from email_service import send_reset_email


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


## New Users
@app.post("/signup", status_code = 201)
def sign_up (data : StaffSignUp, db : Session = Depends(get_db)):
  email_exist = db.query(Staff).filter(Staff.email == data.email).first()
  if email_exist : raise HTTPException (status_code = 409, detail="Email Already Exists")
  hashed_password = hash_password(data.password)
  user = Staff(full_name = data.full_name, email = data.email, password_hash= hashed_password)
  db.add(user)
  db.commit()
  db.refresh(user)
  token = create_access_token(user.id)

  return {"Message": "User Has Been Created", "User ID" : user.id, "token_type" : "bearer", "access_token" : token}

## Login
@app.post("/login", status_code = 200)
def login (data : StaffLogin, db : Session = Depends(get_db)):
  user = db.query(Staff).filter(Staff.email == data.email).first()
  if not user : raise HTTPException (status_code = 401, detail="Invalid email or password")

  hashed_password = user.password_hash
  entered_pass = data.password
  pass_check = check_password(entered_pass, hashed_password)
  

  if not pass_check:
    raise HTTPException (status_code = 401, detail="Invalid email or password")

  token = create_access_token(user.id)

  return {"token_type": "bearer", "access_token": token}


@app.get("/verify-user", status_code = 200)
def verify_user (current_user : Staff = Depends(get_current_user)):
  return{"user_id": current_user.id,"full_name" : current_user.full_name,"user_email":current_user.email}



@app.post("/forgot-password", status_code = 200)

def forgot_password (email : str =Body(embed=True), db : Session = Depends(get_db)):
  user = db.query(Staff).filter(Staff.email == email).first()
  if not user:
    return {"message": "If the email exists, password reset instructions will be sent"}

  token = create_reset_password_token()
  token_hash = hashlib.sha256(token.encode()).hexdigest()
  user_id = user.id
  expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)
  reset_record = PasswordResetToken(user_id=user_id, token_hash=token_hash, expires_at=expires_at)
  db.add(reset_record)
  db.commit()
  send_reset_email(user.email, token)

  return {"message": "If the email exists, password reset instructions will be sent"}


@app.post("/reset-password", status_code = 200)
def reset_password (data : ResetPasswordRequest, db : Session = Depends(get_db)):
  token_hash = hashlib.sha256(data.token.encode()).hexdigest()
  reset_record = db.query(PasswordResetToken).filter(PasswordResetToken.token_hash == token_hash).first()

  if not reset_record or reset_record.used_at is not None or reset_record.expires_at < datetime.now(timezone.utc):
    raise HTTPException(status_code=400, detail="Invalid or expired token")

  if reset_record.used_at is not None:
    raise HTTPException(status_code=400, detail="Token has already been used")

  user = db.query(Staff).filter(Staff.id == reset_record.user_id).first()
  if not user:
    raise HTTPException(status_code=404, detail="User not found")

  user.password_hash = hash_password(data.new_password)
  reset_record.used_at = datetime.now(timezone.utc)
  db.query(PasswordResetToken).filter(
    PasswordResetToken.user_id == user.id,
    PasswordResetToken.used_at.is_(None)
  ).update(
    {"used_at": datetime.now(timezone.utc)},
    synchronize_session=False
  )
  
  db.commit()

  return {"message": "Password has been reset successfully"}