from pydantic import BaseModel


class LicensePlate(BaseModel):
    plate: str


class UserCredentials(BaseModel):
    name: str
    phone_number: str
    email: str
    password: str


class LoginInfo(BaseModel):
    email: str
    password: str


class Vehicle(BaseModel):
    nickname: str = ""
    plate: str = ""
    kind: str = ""
    vehicle_id: str = ""
    user_id: str = ""


class EmailInfo(BaseModel):
    email: str
    label: str

class NotificationEmail():
    def __init__(self, vehicle) -> None:
        self.vehicle = vehicle
        
    def _collectCitations(self) -> str:
        citationList = ""
        for citation in self.vehicle.get("citations"):
            citationList += f"- Location: {citation.get("location")}\tAmount Due: {citation.get("amount_due")}\tIssue Date: {citation.get("issue_date")}\tDue Date: {citation.get("due_date")}\n"
        return citationList
    def build_email(self) -> str:
        return f"""
New or unpaid citation(s) detected for {self.vehicle.get("plate")}

CITATIONS:
{self._collectCitations()}

Provided by the Parking Portal
"""