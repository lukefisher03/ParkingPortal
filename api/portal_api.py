import get_ticket_status
from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import uuid

# import custom types
from custom_types import LicensePlate, UserCredentials, LoginInfo, Vehicle

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

session = {"authenticated": False, "user_id": None}
# Establish a requests session for web scraping


#### Establish routes ####
@app.post("/accounts/signup")
def signup(user_creds: UserCredentials, response: Response):
    response.headers["Access-Control-Request-Headers"] = "Content-Type, Authorization"
    con = sqlite3.connect("master.db")
    message = "User successfully created, please sign in."
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
    except Exception as e:
        response.status_code = status.HTTP_400_BAD_REQUEST
        message = "User could not be created."

    con.close()
    return message


@app.post("/accounts/login")
def login(login_info: LoginInfo, response: Response):
    con = sqlite3.connect("master.db")
    cur = con.cursor()
    message = "Login success"

    stored_hash, user_id = cur.execute(
        "SELECT password, id FROM users WHERE email=?", (login_info.email,)
    ).fetchone()

    if stored_hash == login_info.password:
        session["user_id"] = user_id
        session["authenticated"] = True
        response.status_code = status.HTTP_200_OK
    else:
        message = "Login failed"
        response.status_code = status.HTTP_401_UNAUTHORIZED

    return message


@app.post("/api/addVehicle")
def add_vehicle(vehicle: Vehicle, response: Response):
    if not session["authenticated"]:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return "Not Authorized!"

    con = sqlite3.connect("master.db")

    params = (session["user_id"], str(uuid.uuid4()), vehicle.nickname, vehicle.plate)

    try:
        with con:
            con.execute("INSERT INTO vehicles VALUES(?, ?, ?, ?)", params)
    except sqlite3.IntegrityError as e:
        response.status_code = status.HTTP_403_FORBIDDEN
        return f"Exception:\n {e}"


@app.post("/api/updateVehicleInfo")
def update_plate_info(license_plate: LicensePlate, response: Response):
    con = sqlite3.connect("master.db")
    message = "Successfully retrieved plate data"
    session_info = get_ticket_status.beginSession()

    citations = get_ticket_status.getVehicleInfoByPlate(
        license_plate.license_plate, session_info
    )
    formatted_citations = []
    for citation in citations.values():
        formatted_citation = []
        for _, value in citation.items():
            formatted_citation.append(value)
        formatted_citations.append(tuple(formatted_citation))
        print(formatted_citation)
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
        print(f"An exception occurred: {e}")
        response.status_code = status.HTTP_400_BAD_REQUEST
        message = "Bad request"

    con.close()
    return message