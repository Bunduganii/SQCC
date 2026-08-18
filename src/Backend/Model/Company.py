from Database import db
from datetime import datetime

class Company(db.Model):
    __tablename__ = "companies"
    id = db.Column(db.Integer,primary_key=True)
    owner_user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    business_name = db.Column(db.String(150),nullable=False)
    registartion_number = db.Column(db.String(100),nullable=False)
    tin = db.Column(db.String(100),nullable=True)
    license_document_path = db.Column(db.String(255),nullable=True)
    verification_status = db.Column(db.String(20),nullable=False,default="pending")
    created_at = db.Column(db.DateTime,default=datetime.utcnow)