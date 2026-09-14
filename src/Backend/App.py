from flask import Flask,request,jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import jwt
from Routes.Login import auth_bp

from datetime import datetime,timedelta
from Database import db
from argon2 import PasswordHasher
from Model.Users import User
from Routes.Register import register_bp
from Model.Company import Company
from Routes.Company import company_bp
from Model.Shipment import Shipment
from Routes.Shipment import shipment_bp
load_dotenv()
print(os.getenv("DATABASE_URL"))
app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] =False

db.init_app(app)

ph = PasswordHasher()

# Register blueprint AFTER creating the app app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(auth_bp,url_prefix="/api")
app.register_blueprint(company_bp)
app.register_blueprint(shipment_bp)



# Testing the connection of the datbase 
@app.route("/")
def home():
    try:
        User.query.first()
        return{
            "massege":"Databse ku wuxuu kuu xidhiidhSan Yahay Si Sax Ah"
        } 
    except Exception as e:
        return{
            "error":str(e)
        }
if __name__ == "__main__":
    app.run(debug=True,port=5000)