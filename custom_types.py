from pydantic import BaseModel

class LicensePlate(BaseModel):
    license_plate: str
    
class UserCredentials(BaseModel):
    name: str
    phone_number: str
    email: str
    password_hash: str

class LoginInfo(BaseModel):
    email: str
    password_hash: str

class Vehicle(BaseModel):
    nickname: str
    plate: str