from flask import Blueprint, request, jsonify
from Database import db
from Model.Company import Company
from Utils.auth_required import token_required

company_bp = Blueprint("company_bp", __name__)


@company_bp.route("/api/company/register", methods=["POST"])
@token_required
def register_company():
    if request.user_role != "importer":
        return jsonify({"error": "only importers can register bussiness"}), 403

    data = request.get_json()
    business_name = data.get("business_name")
    registartion_number = data.get("registration_number")
    tin = data.get("tin")

    if not business_name or not registartion_number:
        return jsonify({"error": "Business Name And Registartion Number Are Required"}), 400

    exsiting = Company.query.filter_by(registartion_number=registartion_number).first()
    if exsiting:
        return jsonify({"error": "This Registartion Number Already Registarted"}), 400

    new_company = Company(
        owner_user_id=request.user_id,
        business_name=business_name,
        registartion_number=registartion_number,
        tin=tin,
    )

    db.session.add(new_company)
    db.session.commit()
    return jsonify({"messege": "Company Registered Sucessfully, pending Verification"}), 201


@company_bp.route("/api/company/pending", methods=["GET"])
@token_required
def get_pending_companies():
    if request.user_role != "staff":
        return jsonify({"error": "Only Staff Can View Pending Companies"}), 403

    companies = Company.query.filter_by(verification_status="pending").all()

    result = []
    for c in companies:
        result.append({
            "id": c.id,
            "business_name": c.business_name,
            "registration_number": c.registartion_number,
            "tin": c.tin,
            "owner_user_id": c.owner_user_id,
            "created_at": c.created_at
        })
    return jsonify(result), 200


@company_bp.route("/api/company/verify/<int:company_id>", methods=["POST"])
@token_required
def verify_company(company_id):
    if request.user_role != "staff":
        return jsonify({"error": "Only Staff Can Verify Companies"}), 403

    data = request.get_json()
    decision = data.get("decision")

    if decision not in ["approved", "rejected"]:
        return jsonify({"error": "decision Must Be Approved Or Rejected"}), 400

    company = Company.query.get(company_id)
    if not company:
        return jsonify({"error": "Company not Found"}), 404

    company.verification_status = decision
    db.session.commit()
    return jsonify({"message": f"Company {decision} successfully"}), 200






























































# from flask import Blueprint,request,jsonify
# from Database import db
# from Model.Company import Company
# from Utils.auth_required import token_required

# company_bp = Blueprint("company_bp",__name__)

# @company_bp.route("/api/company/register",methods=["POST"])
# @token_required
# def register_company():
#     data = request.get_json()
#     business_name = data.get("business_name")
#     registartion_number = data.get("registration_number")
#     tin = data.get("tin")

#     if request.user_role != "importer":
#             return jsonify({"error":"only importers can register bussiness"}),403
#     if not business_name or not registartion_number:
#         return jsonify({"error":"Business Name And Registartion Number Are Required"}),400
#     exsiting = Company.query.filter_by(registartion_number=registartion_number).first()
#     if exsiting:
#         return jsonify({"error":"This Registartion Number Already Registarted"}),400
   
    
#     new_company = Company(
#          owner_user_id=request.user_id,
#                 business_name = business_name,
#                registartion_number= registartion_number,
#                 tin = tin,
#     )


#     @company_bp.route("/api/company/pending",methods=["GET"])
#     @token_required
#     def get_pending_companies():
#          if request.user_role !="staff":
#               return jsonify({"error":"Only Staff Can View Pending Comapany pendings"}),403

#          companies = Company.query.filter_by(verification_status="pending").all()

#          result = []
#          for c in companies:
#           result.append({
#               "id":c.id,
#               "business_name":c.business_name,
#               "registration_number":c.registration_number,
#               "tin": c.tin,
#               "owner_user_id": c.owner_user.id,
#               "created_at":c.created_at
#          })
#          return jsonify(result),200


#     @company_bp.route("/api/company/verify/<int:company_id>",methods=["POST"])
#     @token_required
#     def verify_company():
#         if request.user_role != "staff":
#             return jsonify({"error":"Only Staff Can Verify Companies"}),403

#     data = request.get_json()
#     decision = data.get("decision")

#     if decision not in ["approved","rejected"]:
#         return jsonify({"erorr":"decision Must Be Approved Or Rejected"}),400

#     company = Company.query.get(company_id)
#     if not company:
#         return jsonify({"erorr":"Company not Found"}),404

#     company.verification_status = decision
#     db.session.commit()
#     return jsonify({"massege":f"Company{decision} successfully"}),200
#     db.session.add(new_company)
#     db.session.commit()
#     return jsonify({"messege":"Company Registered Sucessfully,pending Verification"})
 