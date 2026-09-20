from flask import Blueprint,request,jsonify
from Database import db
from Model.Shipment import Shipment
from Model.Company import Company
from Utils.auth_required import token_required

shipment_bp = Blueprint("shipment_bp",__name__)

@shipment_bp.route("/api/shipment/submit",methods=["POST"])
@token_required
def submit_shipment ():
    if request.user_role !="importer":
        return jsonify({"error":"Only Importers will submit shipments"}),403
    data = request.get_json()
    product_name = data.get("product_name")
    product_category = data.get("product_category")
    quantity = data.get("quantity")
    if not product_name or not product_category or not quantity:
        return jsonify({"error":"product name category quantity are required"}),400
    company = Company.query.filter_by(owner_user_id=request.user_id).first()
    if not company:
        return jsonify({"error":"You must Register The Comapny Before Submiting Shipment"}),400
    if company.verification_status != "approved":
        return jsonify({"error":"Your Company Must Be Verified By Haayad Tayo Dhawrista Somalilan(SQCC)"}),403
    new_shipment = Shipment(
        company_id = company.id,
        product_name = product_name,
        product_category = product_category,
        quantity = quantity
    )
    db.session.add(new_shipment)
    db.session.commit()
    return jsonify({"massege":"You Successfuly Submitted Shipmet, pending review"}),201



@shipment_bp.route("/api/shipment/pending", methods=["GET"])
@token_required
def get_pending_shipments():
    if request.user_role != "staff":
        return jsonify({"error": "Only staff can view pending shipments"}), 403

    shipments = Shipment.query.filter_by(status="pending").all()

    result = []
    for s in shipments:
        result.append({
            "id": s.id,
            "company_id": s.company_id,
            "product_name": s.product_name,
            "product_category": s.product_category,
            "quantity": s.quantity,
            "submitted_at": s.submitted_at
        })

    return jsonify(result), 200


@shipment_bp.route("/api/shipment/verify/<int:shipment_id>", methods=["POST"])
@token_required
def verify_shipment(shipment_id):
    if request.user_role != "staff":
        return jsonify({"error": "Only staff can verify shipments"}), 403

    data = request.get_json()
    decision = data.get("decision")

    if decision not in ["approved", "rejected"]:
        return jsonify({"error": "Decision must be 'approved' or 'rejected'"}), 400

    shipment = Shipment.query.get(shipment_id)
    if not shipment:
        return jsonify({"error": "Shipment not found"}), 404

    shipment.status = decision
    shipment.reviewed_by = request.user_id

    if decision == "approved":
        shipment.certificate_number = f"SQCC-{shipment.id:05d}-{shipment.submitted_at.year}"

    db.session.commit()

    return jsonify({
        "message": f"Shipment {decision} successfully",
        "certificate_number": shipment.certificate_number
    }), 200
@shipment_bp.route("/api/shipment/mine",methods=["GET"])
@token_required
def get_shipment():
    if request.user_role != "importer":
        return jsonify({"error":"only importer can view their shipment"}),403
    company = Company.query.filter_by(owner_user_id=request.user_id).first()
    if not company:
        return jsonify([]),200
    shipments = Shipment.query.filter_by(company_id=company.id).all()
    resullt = []
    for s in shipments:
        resullt.append({
            "id":s.id,
            "product_name":s.product_name,
            "product_category":s.product_category,
            "quantity":s.quantity,
            "status":s.status,
            "certificate_number":s.certificate_number,
            "submitted_at":s.submitted_at
        })
        return jsonify(resullt),200
