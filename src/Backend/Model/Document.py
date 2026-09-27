from Database import db
from datetime import datetime

class Document(db.Model):
    __tablename__ = "documents"
    id =db.Column(db.Integer, primary_key=True)
    shipment_id = db.Column(db.Integer,db.ForeignKey("shipments.id"),nullable=False)
    file_name = db.Column(db.String(255),nullable=False)
    file_path = db.Column(db.String(500),nullable=False)
    document_type = db.Column(db.String(100))
    uploaded_at = db.Column(db.DateTime,server_default=db.func.now())
    shipment = db.relationship("Shipment",backref="documents")