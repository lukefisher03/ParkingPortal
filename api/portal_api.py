import time
import get_ticket_status
from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import uuid
from datetime import datetime, timedelta, timezone

# import custom types
from custom_types import LicensePlate, UserCredentials, LoginInfo, Vehicle, EmailInfo, NotificationEmail
from smtp_email import send_notification_emails

app = FastAPI()
DATABASE = "master.db"
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
)

VEHICLE_KINDS = ["suv", "sedan", "truck", "van"]
NOTIFICATION_CADENCE = 7 # Notify every 7 days
session = {"authenticated": False, "user_id": None, "user": {}}
# Establish a requests session for web scraping


#### Establish routes ####
@app.post("/accounts/signup/")
def signup(user_creds: UserCredentials, response: Response):
    server_response = {}
    con = sqlite3.connect(DATABASE)
    params = (
        str(uuid.uuid4()),
        user_creds.name,
        user_creds.phone_number,
        user_creds.email,
        user_creds.password,
    )

    try:
        with con:
            con.execute("INSERT INTO users VALUES (?,?,?,?,?)", params)
            response.status_code = status.HTTP_200_OK
            session["user_id"] = params[0]
            session["authenticated"] = True
            session["user"] = {
                "name": user_creds.name,
                "email": user_creds.email
            }
            server_response["authenticated"] = True
            server_response["error"] = None
            server_response["user_id"] = params[0]
    except sqlite3.IntegrityError as e:
        response.status_code = status.HTTP_400_BAD_REQUEST
        server_response["authenticated"] = False
        server_response["error"] = (
            "Email or phone number already registered, try logging in"
        )
    except Exception as e:
        response.status_code = status.HTTP_400_BAD_REQUEST
        server_response["authenticated"] = False
        server_response["error"] = "User could not be created."

    con.close()
    return server_response


@app.post("/accounts/login/")
def login(login_info: LoginInfo, response: Response):
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    server_response = {}
    res = cur.execute(
        "SELECT * FROM users WHERE email=?", (login_info.email,)
    )

    item = res.fetchone()

    if not item:
        response.status_code = status.HTTP_404_NOT_FOUND
        server_response["authenticated"] = False
        server_response["error"] = "Could not locate that account"
        return server_response
    
    user_id, name, phone_number, email, password = item
    if password == login_info.password:
        session["user_id"] = item[0]
        session["authenticated"] = True
        session["user"] = {
            "name": name,
            "email": email,
        }
        server_response["authenticated"] = True
        server_response["userId"] = user_id
        server_response["error"] = None
        response.set_cookie(
            "userId",
            user_id,
            expires=datetime.now().replace(tzinfo=timezone.utc) + timedelta(days=5),
        )
        response.status_code = status.HTTP_200_OK
    else:
        server_response["error"] = "Incorrect email or password, please try again"
        server_response["userId"] = None
        server_response["authenticated"] = False
        response.status_code = status.HTTP_401_UNAUTHORIZED
    return server_response


@app.post("/accounts/addUserEmail/")
def addUserEmail(email_info: EmailInfo, response: Response):
    if not session["authenticated"]:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return response.status_code
    con = sqlite3.connect(DATABASE)
    try:
        with con:
            con.execute(
                "INSERT INTO emails VALUES(?, ?, ?)",
                (
                    session["user_id"],
                    email_info.email,
                    email_info.label,
                ),
            )
            response.status_code = status.HTTP_200_OK
            return response.status_code
    except sqlite3.IntegrityError as e:
        response.status_code = status.HTTP_409_CONFLICT
        return response.status_code
    except Exception as e:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return response.status_code


@app.post("/accounts/removeUserEmail/")
def removeUserEmail(email_info: EmailInfo, response: Response):
    con = sqlite3.connect(DATABASE)

    if not session["authenticated"]:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return response.status_code
    try:
        with con:
            con.execute(
                "DELETE FROM emails WHERE user_id=? AND email=? AND label=?",
                (
                    session["user_id"],
                    email_info.email,
                    email_info.label,
                ),
            )
            response.status_code = status.HTTP_200_OK
            return response.status_code
    except sqlite3.IntegrityError as e:
        response.status_code = status.HTTP_409_CONFLICT
        return response.status_code
    except Exception as e:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return response.status_code


@app.get("/accounts/getUserDelegateEmails/")
def getUserDelegateEmails(response: Response):
    if not session["authenticated"]:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return response.status_code

    con = sqlite3.connect(DATABASE)

    try:
        with con:
            email_list = con.execute(
                "SELECT email, label FROM emails WHERE user_id=?",
                (session["user_id"],),
            ).fetchall()
            session["user"]["delegate_emails"] = [item[0] for item in email_list]
            response.status_code = status.HTTP_200_OK
            return [
                {k: v for (k, v) in zip(["email", "label"], item)}
                for item in email_list
            ]
    except Exception as e:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return response.status_code


@app.post("/api/addVehicle/")
def add_vehicle(vehicle: Vehicle, response: Response):
    if vehicle.kind.lower() not in VEHICLE_KINDS:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return "Bad request, vehicle type is not valid"

    if not session["authenticated"]:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return "Not Authorized!"

    con = sqlite3.connect(DATABASE)

    params = (
        session["user_id"],
        str(uuid.uuid4()),
        vehicle.nickname,
        vehicle.plate.upper(),
        vehicle.kind.lower(),
        int(time.time()), # last notification date
        0  # number of notifications
    )

    try:
        with con:
            con.execute("INSERT INTO vehicles VALUES(?, ?, ?, ?, ?, ?, ?)", params)
            response.status_code = status.HTTP_200_OK
            return
    except sqlite3.IntegrityError as e:
        response.status_code = status.HTTP_409_CONFLICT
        return
    except Exception:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return


@app.post("/api/removeVehicle/")
def remove_vehicle(vehicle: Vehicle, response: Response):
    if not session["authenticated"]:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return "Not authorized"
    if not vehicle.vehicle_id or not vehicle.user_id:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return "Missing data"

    con = sqlite3.connect(DATABASE)
    cur = con.execute(
        "DELETE FROM vehicles WHERE vehicle_id=? AND user_id=?",
        (
            vehicle.vehicle_id,
            vehicle.user_id,
        ),
    )
    con.commit()
    con.close()
    response.status_code = status.HTTP_200_OK
    return


@app.get("/api/getUser/")
def getUser(user_id: str, response: Response):  # Need to add error handling to this
    if not session["authenticated"]:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {}
    con = sqlite3.connect(DATABASE)

    cur = con.execute(
        "SELECT user_id, name, email, phone_number FROM users WHERE user_id=?",
        (user_id,),
    )

    response.status_code = status.HTTP_200_OK
    return {k: v for (k, v) in zip([x[0] for x in cur.description], cur.fetchone())}


@app.get("/api/getCitations/")
def getCitations(plate: str, response: Response):  # Need to add error handling to this
    con = sqlite3.connect(DATABASE)
    
    if not session["authenticated"]:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {}
    cur = con.execute("SELECT * FROM citations WHERE plate=?", (plate,))
    citationRows = cur.fetchall()

    if not citationRows:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {}

    d = [
        {k: v for (k, v) in zip([x[0] for x in cur.description], citation)}
        for citation in citationRows
    ]  # i know, i know...
    con.close()
    return d 

@app.get("/api/getVehicles/")
def getVehicles(user_id: str, response: Response):
    con = sqlite3.connect(DATABASE)

    vehicleList = []

    with con:
        vehicleRows = con.execute("SELECT * FROM vehicles WHERE user_id=?", (user_id,))
        for vehicleData in vehicleRows.fetchall():
            vehicle = {}

            for t, v in zip([x[0] for x in vehicleRows.description], vehicleData):
                vehicle[t] = v
            vehicleList.append(vehicle)

    return vehicleList

@app.post("/api/manageNotifications/")
def manageNotifications(response: Response):
    msg = ""
    vehicles_to_notify = []
    getVehicleResponse = Response
    con = sqlite3.connect(DATABASE)

    if not session["authenticated"]:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return

    vehicleList = getVehicles(session["user_id"], getVehicleResponse)

    for vehicle in vehicleList:
        days_since_last_notification = (int(time.time()) - vehicle.get("last_notification_date")) // 864e2

        if (days_since_last_notification > NOTIFICATION_CADENCE or vehicle.get("notification_count") <= 0):
            citationResponse = Response
            citations = getCitations(vehicle.get("plate"), citationResponse)
            open_citations = False

            vehicle["citations"] = []
            for citation in citations:
                if citation.get("amount_due") != "None":
                    open_citations = True
                    vehicle["citations"].append(citation)
            if open_citations:
                vehicles_to_notify.append(vehicle)
    with con:
        if vehicles_to_notify:
            for v in vehicles_to_notify:
                con.execute("UPDATE vehicles SET last_notification_date=?, notification_count=? WHERE vehicle_id=?", (int(time.time()), v.get("notification_count") + 1, v.get("vehicle_id")))
    
    if vehicles_to_notify:
        delegateEmails = [item["email"] for item in getUserDelegateEmails(Response)]
        send_notification_emails(vehicles_to_notify, [session["user"].get("email"), *delegateEmails])

    response.status_code = status.HTTP_200_OK


@app.get("/api/getVehicle/")
def getVehicle(plate: str, user_id: str, response: Response):
    con = sqlite3.connect(DATABASE)

    with con:
        vehicleRow = con.execute(
            "SELECT * FROM vehicles WHERE plate=? AND user_id=?",
            (
                plate,
                user_id,
            ),
        )

        row = vehicleRow.fetchone()
        vehicle = {k: v for (k, v) in zip([x[0] for x in vehicleRow.description], row)}
    return vehicle


@app.post("/api/updateVehicleInfo/")
def update_plate_info(plate: LicensePlate, response: Response):
    con = sqlite3.connect(DATABASE)
    message = "Successfully retrieved plate data"
    session_info = get_ticket_status.beginSession()

    citations = get_ticket_status.getVehicleInfoByPlate(plate.plate, session_info)

    if not citations:
        response.status_code = status.HTTP_204_NO_CONTENT
        return "No citations found"

    formatted_citations = []
    for citation in citations.values():
        formatted_citation = []
        for _, value in citation.items():
            formatted_citation.append(value)
        formatted_citations.append(tuple(formatted_citation))
    try:
        with con:
            con.executemany(
                "INSERT INTO citations VALUES (?,?,?,?,?,?,?,?,?) \
                    ON CONFLICT(citation_number) DO UPDATE SET \
                        location=excluded.location, plate=excluded.plate, \
                        vin=excluded.vin, issue_date=excluded.issue_date, \
                        due_date=excluded.due_date, \
                        status=excluded.status, \
                        amount_due=excluded.amount_due, \
                        citation_link=excluded.citation_link",
                formatted_citations,
            )
            response.status_code = status.HTTP_200_OK
    except Exception as e:
        response.status_code = status.HTTP_400_BAD_REQUEST
        message = "Bad request"

    con.close()
    return message