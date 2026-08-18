from flask import Blueprint, request, jsonify
from Database import db
from Model.Users import User
from argon2 import PasswordHasher

register_bp = Blueprint("register", __name__)

ph = PasswordHasher()


@register_bp.route("/register", methods=["POST"])
def register():

    try:
        data = request.get_json()

        print("REGISTER DATA:", data)

        if not data:
            return jsonify({
                "error": "No registration data received"
            }), 400

        full_name = data.get("full_name", "").strip()
        email = (data.get("email")or "").strip().lower() or None
        goverment_id =(data.get("goverment_id")or "").strip().lower() or None
        password = data.get("password", "")

        # -------------------------
        # Validate full name
        # -------------------------

        if not full_name:
            return jsonify({
                "error": "Full name is required"
            }), 400

        # -------------------------
        # Validate email
        # -------------------------

        if not email and not goverment_id:
            return jsonify({
                "error": "Email gali am card ka aqoonsiga numberkisa"
            }), 400

        # -------------------------
        # Validate government ID
        # -------------------------

        # if not goverment_id:
        #     return jsonify({
        #         "error": "Government ID is required"
        #     }), 400

        # -------------------------
        # Validate password
        # -------------------------

        if not password:
            return jsonify({
                "error": "Password is required"
            }), 400

        if len(password) < 8:
            return jsonify({
                "error": "Password must be at least 8 characters"
            }), 400

        # -------------------------
        # Check email
        # -------------------------

        existing_email = User.query.filter_by(
            email=email
        ).first()

        if existing_email:
            return jsonify({
                "error": "Email already exists"
            }), 409

        # -------------------------
        # Check Government ID
        # -------------------------

        existing_government_id = User.query.filter_by(
            goverment_id=goverment_id
        ).first()

        if existing_government_id:
            return jsonify({
                "error": "Government ID already exists"
            }), 409

        # -------------------------
        # Hash password
        # -------------------------

        password_hash = ph.hash(password)

        # -------------------------
        # Create CITIZEN
        # -------------------------

        new_user = User(
            full_name=full_name,
            email=email,
            goverment_id=goverment_id,
            password_hash=password_hash,

            # IMPORTANT
            # Public registration ALWAYS creates
            # a citizen.
            rolee="public",

            status="active"
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": "Citizen registered successfully",
            "user": {
                "id": new_user.id,
                "full_name": new_user.full_name,
                "email": new_user.email,
                "goverment_id": new_user.goverment_id,
                "rolee": new_user.rolee,
                "status": new_user.status
            }
        }), 201

    except Exception as e:

        db.session.rollback()

        print("REGISTER ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500