from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import jwt
import os
from datetime import datetime,timedelta,timezone
ph =PasswordHasher()

def hash_password(plain_password):
 return ph.hash(plain_password)

def verify_pass(plain_password,hashed_password):
 try:
  return ph.verify(hashed_password,plain_password)
 except VerifyMismatchError:
  return False

def Create_token(user_id,role):
 paylaod ={
  "id":user_id,
  "rolee":role,
  "created_at":datetime.now(timezone.utc) +timedelta(days=1)
 }