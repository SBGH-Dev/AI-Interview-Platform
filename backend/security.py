from pwdlib import PasswordHash
import os 
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import jwt


load_dotenv()
password_hasher = PasswordHash.recommended()

def hash_password (password : str):
  return password_hasher.hash(password)

def check_password (plain_pass : str, hashed_pass : str):
  return password_hasher.verify(plain_pass, hashed_pass)



def create_access_token(user_id : int):
  
  SECRET_KEY = os.environ["SECRET_KEY"]
  EXP_TIME = int(os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"])
  time_now = datetime.now(timezone.utc)
  token_exp_time = time_now + timedelta(minutes=EXP_TIME)
  payload = {"sub" : str(user_id), "exp":token_exp_time}
  token = jwt.encode(payload, SECRET_KEY, "HS256")
  return token
