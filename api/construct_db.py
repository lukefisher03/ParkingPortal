import sqlite3

"""
Build and stand up SQLite database
"""

con = sqlite3.connect("master.db")
cur = con.cursor()

cur.execute("CREATE TABLE users (id UNIQUE, name, phone_number UNIQUE, email UNIQUE, password_hash)")
cur.execute("CREATE TABLE vehicles (owner_id, vehicle_id, nickname, plate, UNIQUE(owner_id, plate), UNIQUE(owner_id, nickname))")
cur.execute("CREATE TABLE citations (citation_number UNIQUE, location, plate, vin, issue_date, due_date, status, amount_due, citation_link)")
con.commit()

con.close()