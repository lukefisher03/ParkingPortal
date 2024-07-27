import requests
import json

def testAuthentication():
    results = ""
    signup = {
        "name": "Luke Fisher",
        "phone_number": "1234567890",
        "email": "test@testing.com",
        "password": "password"
    }

    login = {
        "email": "test@testing.com",
        "password": "password"
    }

    # Attempt a valid sign up

    print("Attempting to sign up...")
    try:
        signup_response = requests.post("http://localhost:8000/accounts/signup/", data=json.dumps(signup))
        results += f"Signup successfully completed. UserID: {signup_response.json()["user_id"]}\n"
    except:
        if signup_response.status_code > 299:
            results += f"Signup test failed -> status code:{signup_response.status_code}, error: {signup_response.json()["error"]}\n"


    # Attempt to sign up with the same credentials
    try:
        signup_response = requests.post("http://localhost:8000/accounts/signup/", data=json.dumps(signup))
        if signup_response.status_code < 300:
            results += f"Signup test failed -> Duplicate users not handled properly in sign up endpoint\n"
        else:
            results += f"Signup successfully rejected a duplicate sign up\n"
    except:
        print("bad request")

    try:
        login_response = requests.post("http://localhost:8000/accounts/login/", data=json.dumps(login))
        
        if login_response.status_code < 300:
            results += f"Login succeeded {login_response.status_code}\n"
        else:
            results += f"Login failed {login_response.status_code}\n"
    except:
        print("Something happened with the second sign up test")
    
    try:
        login_response = requests.post("http://localhost:8000/accounts/login/", data=json.dumps(login))
        if login_response < 300:
            results += f"Login authentication failed\n"
        else:
            results += f"Server successfully rejects incorrect login\n"
    except:
        results += f"Server successfully rejects incorrect login\n"
    return results

def testVehicleActions():
    results = ""
    vehicle = {
        "nickname": "Luke's Car",
        "plate": "JJN4759",
        "kind": "sedan",
    }
    print("Attempting to add vehicle...")
    try:
        add_vehicle_response = requests.post("http://localhost:8000/api/addVehicle/", data=json.dumps(vehicle))
        if add_vehicle_response.status_code < 300:
            results += f"Add vehicle test successfully completed\n"
        else:
            results += f"Add vehicle test failed {add_vehicle_response.status_code}"
    except:
        results += f"Failure\n"

    
    try:
        add_vehicle_response = requests.post("http://localhost:8000/api/addVehicle/", data=json.dumps(vehicle))
        if add_vehicle_response.status_code > 300:
            results += f"Add vehicle test successfully rejected a duplicate entry\n"
        else:
            results += f"Add vehicle test failed {add_vehicle_response.status_code}"
    except:
        results += f"Failure\n"

    get_vehicle_response = requests.get(f"http://localhost:8000/api/getVehicle/?plate={vehicle["plate"]}").json()
    vehicle["vehicle_id"] = get_vehicle_response["vehicle_id"]
    vehicle["user_id"] = get_vehicle_response["user_id"]

    try:
        remove_vehicle_response = requests.post("http://localhost:8000/api/removeVehicle/", data=json.dumps(vehicle))
        if remove_vehicle_response.status_code < 300:
            results += f"Remove vehicle test successfully completed\n"
        else:
            results += f"Remove vehicle test failed {remove_vehicle_response.status_code}"
    except:
        results += f"Failure\n"

    
    try:
        update_vehicle_response = requests.post("http://localhost:8000/api/updateVehicleInfo/", data=json.dumps({"plate":vehicle["plate"]}))
        if update_vehicle_response.status_code < 300:
            results += f"Update vehicle info test successfully completed\n"
        else:
            results += f"Update vehicle test failed {update_vehicle_response.status_code}"
    except:
        results += f"Failure\n"

    
    

    return results
    
if __name__ == "__main__":
    print("USER OPERATION TESTS")
    print(testAuthentication())
    print("VEHICLE OPERATIONS TESTS")
    print(testVehicleActions())