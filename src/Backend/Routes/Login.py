from flask import Blueprint, request, jsonify
from Database import db
from Model.Users import User
from Schemes.Auth import RegisterSchema, LoginSchema
from Utils.Password import hash_password, verify_pass
from Utils.jwt_handler import create_token

auth_bp = Blueprint("auth", __name__)
register_schema = RegisterSchema()
login_schema = LoginSchema()

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    errors = register_schema.validate(data)
    if errors:
        return jsonify({"errors": errors}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409

    new_user = User(
        full_name=data["full_name"],
        email=data["email"],
        goverment_id=data["goverment_id"],
        password_hash=hash_password(data["password"]),
        rolee=data["rolee"]
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "waa Lagu Guuleystay Diwaan Gelinta"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    errors = login_schema.validate(data)
    if errors:
        return jsonify({"errors": errors}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not verify_password(data["password"], user.password_hash):
        return jsonify({"error": "Waxaa Khaldan email am password"}), 401

    token = create_token(user.id, user.rolee)
    return jsonify({
        "token": token,
        "user": {"id": user.id, "full_name": user.full_name, "rolee": user.rolee}
    }), 200