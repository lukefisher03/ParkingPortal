import sqlite3

"""
Build and stand up SQLite database
"""

con = sqlite3.connect("master.db")
cur = con.cursor()

cur.execute(
    "CREATE TABLE emails (user_id, email, label, UNIQUE(user_id, email, label))"
)

cur.execute(
    "CREATE TABLE users (user_id UNIQUE, name, phone_number UNIQUE, email UNIQUE, password)"
)
cur.execute(
    "CREATE TABLE vehicles (user_id, vehicle_id, nickname, plate, kind, last_notification_date, notification_count, UNIQUE(user_id, plate), UNIQUE(user_id, nickname))"
)
cur.execute(
    "CREATE TABLE citations (citation_number UNIQUE, location, plate, vin, issue_date, due_date, status, amount_due, citation_link)"
)
con.commit()

con.close()
