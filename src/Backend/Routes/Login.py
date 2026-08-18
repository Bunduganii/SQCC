from flask import Blueprint, request, jsonify
from Database import db
from Model.Users import User
from Schemes.Auth import RegisterSchema, LoginSchema
from Utils.Password import hash_password, verify_pass
from Utils.jwt_handler import create_token
from Utils.auth_required import token_required
from Utils.auth_required import token_required,admin_required

auth_bp = Blueprint("auth", __name__)
register_schema = RegisterSchema()
login_schema = LoginSchema()

@auth_bp.route("/register", methods=["POST"])


def register():
    
    data = request.get_json()
    print("INCOMING DATA:",data)
    errors = register_schema.validate(data)
    print("VALIDATIONS ERROR:",errors)
    if errors:
        return jsonify({"errors": errors}), 400

    email = (data.get("email") or "").strip().lower() or None
    goverment_id = (data.get("goverment_id") or "").strip() or None

    if not email and not goverment_id:
        return jsonify({"error": "Please provide an email or national ID"}), 400

    if email and User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    if goverment_id and User.query.filter_by(goverment_id=goverment_id).first():
        return jsonify({"error": "National ID already registered"}), 409

    new_user = User(
        full_name=data["full_name"],
        email=email,
        goverment_id=goverment_id,
        password_hash=hash_password(data["password"]),
        rolee="citizen",
        status="active"
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Account created successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    errors = login_schema.validate(data)
    if errors:
        return jsonify({"errors": errors}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not verify_pass(data["password"], user.password_hash):
        return jsonify({"error": "Waxaa Khaldan email am password"}), 401

    token = create_token(user.id, user.rolee)
    return jsonify({
        "token": token,
        "user": {"id": user.id, "full_name": user.full_name, "rolee": user.rolee}
    }), 200

@auth_bp.route("/me",methods=["GET"])
@token_required
def get_current_user():
    user = User.query.get(request.user_id)

    if not user:
        return jsonify({"error":"User not Found"}),404
    return jsonify({
        "id":user.id,
        "full_name":user.full_name,
        "email":user.email,
        "goverment_id":user.goverment_id,
        "rolee":user.rolee,
        "status":user.status
    }),200
@auth_bp.route("/admin/create-staff", methods=["POST"])
@admin_required
def create_staff():
    data = request.get_json()
    full_name = (data.get("full_name")or "").strip()
    email = (data.get("email")or "").strip().lower() or None
    goverment_id = (data.get("goverment_id")or "").strip().lower() or None
    password = data.get("password", "")

    if not full_name:
        return jsonify({"error":"Magac Dhamaystirani Waa Muhiim"}),400
    if not goverment_id:
        return jsonify({"error":"Goverment ID gu Waa Muhiim"}),400
    if not password or len(password) < 8:
        return jsonify({"error":"Password Ku Waa inuu Noqodaa 8 Character"}),400
    if email and User.query.filter_by(email=email).first():
        return jsonify({"error":"Email Kani Waa Mid Jira"}),409
    
    if User.query.filter_by(goverment_id=goverment_id).first():
            return jsonify({"error":"Goverment Id Gani Waa Mid Jira"}),409
    new_staff = User(
        full_name=full_name,
        email=email,
        goverment_id=goverment_id,
        password_hash=hash_password(password),
        rolee="staff",
        status="active"
    )
    db.session.add(new_staff)
    db.session.commit()

    return jsonify({
        "messege":"Waad Ku Guleesatay Inaad Sameeso Account Ka Staff Ka",
        "user":{
            "id":new_staff.id,
            "full_name":new_staff.full_name,
            "rolee":new_staff.rolee
        }
        }),201


@auth_bp.route("/register-importer",methods=["POST"])
def register_importer():
    data = request.get_json()
    result = RegisterSchema().load(data)
    email = result.get("email")
    goverment_id = result.get("goverment_id")
    password = result.get("password")

    if not email and not goverment_id:
        return jsonify({"error":"Email and goverment id is required"}),400
    new_user = User(
        full_name=result.get("full_name"),
        email=email,
        goverment_id=goverment_id,
        password_hash = hash_password(password),
        rolee="importer"
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message":"Importer succfully Registered"}),201