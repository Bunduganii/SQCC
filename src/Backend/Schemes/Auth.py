from marshmallow import Schema,fields,validate

class RegisterSchema(Schema):
    full_name = fields.String(required=True,validate=validate.Length(min=2))
    email = fields.Email(required=True)
    goverment_id = fields.String(required=True)
    password_hash = fields.String(required=True,validate=validate.Length(min=8))
    rolee = fields.String(required=True,validate=validate.OneOf(["citizen","staff","admin"]))

class LoginSchema(Schema):
    email =fields.Email(required=True)
    password_hash = fields.String(required=True)