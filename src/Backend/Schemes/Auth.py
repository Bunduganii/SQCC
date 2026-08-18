from marshmallow import Schema,fields,validate

class RegisterSchema(Schema):
    full_name = fields.String(required=True,validate=validate.Length(min=2))
    email = fields.Email(required=False,allow_none=True)
    goverment_id = fields.String(required=False,allow_none=True)
    password = fields.String(required=True,validate=validate.Length(min=8))
   
class LoginSchema(Schema):
    email =fields.Email(required=True,allow_none=True)
    password = fields.String(required=True)