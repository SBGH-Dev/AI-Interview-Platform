from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas import StaffSignUp, StaffLogin
from database import get_db
from models import Staff
from security import hash_password, check_password, create_access_token
from auth import get_current_user
from fastapi.middleware.cors import CORSMiddleware


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



