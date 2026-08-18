from Database import db
from datetime import datetime

class Shipment(db.Model):
    __tablename__ = "shipments"

    id = db.Column(db.Integer,primary_key=True)
    company_id = db.Column(db.Integer,db.ForeignKey("companies.id"))
    product_name = db.Column(db.String(150),nullable=False)
    product_category = db.Column(db.String(100),nullable=False)
    quantity = db.Column(db.Integer,nullable=False)
    status = db.Column(db.String(20),nullable=False , default="pending")
    certificate_number = db.Column(db.String(50),nullable=False)
    reviewed_by = db.Column(db.Integer, db.ForeignKey("users.id"),nullable=True)
    review_notes = db.Column(db.Text,nullable=True)
    submitted_at = db.Column(db.DateTime,default=datetime.utcnow)
    review_at = db.Column(db.DateTime,nullable=True)


