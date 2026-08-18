from App import app
from Database import db
from Model.Users import User
from Utils.Password import hash_password

with app.app_context():
    admin = User(
        full_name="System Admin",
        email="admin@qcc.so",
        goverment_id="ADMIN-0001",
        password_hash=hash_password("2345678910"),
        rolee="admin",
        status="active"
    )
    db.session.add(admin)
    db.session.commit()
    print("Waad Ku Guleestey Inaad Sameeso Account Ka:",admin.id)
    # waan is ticmaaley but dib ha u run gareen