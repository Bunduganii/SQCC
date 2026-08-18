from functools import wraps
from flask import request,jsonify
from jose import jwt,JWTError
import os

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHIM = "HS256"

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer"):
            return jsonify({"error":"Token Is Missing"}),401
        token = auth_header.split(" ")[1]
        try:
            payload =jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHIM])
        except JWTError:
            return jsonify({"error":"Token is Invalid or Expried"}),401
        request.user_id = payload.get("id")
        request.user_role = payload.get("rolee")

        return f(*args,**kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer"):
            return jsonify({"error":"Token Missing"}),401
        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHIM])
        except JWTError :
            return jsonify({"error":"Token Is Invalid Or Expired"}),401
        if payload.get("rolee") !="admin":
            return jsonify({"error":"Admins only Can enter"})
        request.user_id = payload.get("id")
        request.user_role = payload.get("rolee")

        return f(*args, **kwargs)
    return decorated