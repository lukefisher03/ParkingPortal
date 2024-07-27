"use server"

import { Vehicle } from "./script"
import { ServerResponse } from "./utils"
//server actions heehee

export const addVehicle = async (plate: string, nickname: string, kind: string): Promise<ServerResponse> => {
    const serverResponse: ServerResponse = {
        error: false,
        body: ""
    }
    const apiUrl = "http://127.0.0.1:8000/api/addVehicle/"
    const updateVehicleApiUrl = `http://127.0.0.1.:8000/api/updateVehicleInfo/`

    const body = {
        plate: plate,
        nickname: nickname,
        kind: kind
    }

    if (!body.plate || !body.nickname || !body.kind) {
        serverResponse.body = "Please fill out the entire form"
        serverResponse.error = true
        return serverResponse
    }

    const requestOptions: RequestInit = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        }
    }

    const response = await fetch(apiUrl, { ...requestOptions, body: JSON.stringify(body) })
    const updateVehicleResponse = await fetch(updateVehicleApiUrl, { ...requestOptions, body: JSON.stringify({ plate: plate }) })

    switch (response.status) {
        case 200:
            serverResponse.body = "Vehicle successfully added"
            serverResponse.error = false
            break;
        case 401:
            serverResponse.body = "Please re-authenticate to add vehicle"
            serverResponse.error = true
            break;
        case 409:
            serverResponse.body = "Vehicle already exists in your account"
            serverResponse.error = true
            break;
        case 400:
            serverResponse.body = "Your request could not be completed at this time, please try again later"
            serverResponse.error = true
            break;
        default:
            serverResponse.body = "An unknown error occurred"
            serverResponse.error = true
            break;
    }

    return serverResponse
}

export const removeVehicle = async (vehicle: Vehicle): Promise<ServerResponse> => {
    const apiUrl = "http://127.0.0.1:8000/api/removeVehicle/"
    const serverResponse: ServerResponse = {
        error: true,
        body: ""
    }

    const requestOptions: RequestInit = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: vehicle.userId,
            vehicle_id: vehicle.vehicleId,
        })
    }


    const response = await fetch(apiUrl, requestOptions)

    switch (response.status) {
        case 200:
            serverResponse.body = "Vehicle was successfully removed"
            serverResponse.error = false
            break
        case 401:
            serverResponse.body = "Not authorized, please authenticate before performing this action"
            serverResponse.error = true
            break
        case 403:
            serverResponse.body = "Bad request, something went wrong. Probably something on our end"
            serverResponse.error = true
        default:
            break
    }

    return serverResponse
}


export type DelegateEmail = {
    email: string,
    label: string
}
export type GetDelegateEmailsResponse = ServerResponse & {
    emailList: DelegateEmail[]
}

export const getUserDelegateEmails = async (): Promise<GetDelegateEmailsResponse> => {
    const serverResponse: GetDelegateEmailsResponse = {
        error: false,
        body: "",
        emailList: []
    }
    const apiUrl = "http://127.0.0.1:8000/accounts/getUserDelegateEmails/"
    const response = await fetch(apiUrl)
    const jsonResponse = await response.json()
    switch (response.status) {
        case 200:
            serverResponse.error = false
            serverResponse.body = "Succesfully retrieved data"
            serverResponse.emailList = jsonResponse as unknown as DelegateEmail[]
            break;
        default:
            serverResponse.error = true
            serverResponse.body = "An error occured"
            break;
    }

    return serverResponse
}

export const removeUserDelegateEmail = async (emailItem: DelegateEmail): Promise<ServerResponse> => {
    const serverResponse: ServerResponse = {
        error: false,
        body: "",
    }


    const requestOptions: RequestInit = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(emailItem)
    }

    const apiUrl = "http://127.0.0.1:8000/accounts/removeUserEmail/"
    const response = await fetch(apiUrl, requestOptions)

    switch (response.status) {
        case 200:
            serverResponse.error = false
            serverResponse.body = "Successfully deleted user email"
            break;
        case 401:
            serverResponse.error = true
            serverResponse.body = "Please log in first"
            break
        default:
            serverResponse.error = true
            serverResponse.body = "An error occured"
            break;
    }

    return serverResponse
}

export const addUserDelegateEmail = async (emailItem: DelegateEmail) => {
    const serverResponse: ServerResponse = {
        error: false,
        body: "",
    }

    const requestOptions: RequestInit = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(emailItem)
    }

    const apiUrl = "http://127.0.0.1:8000/accounts/addUserEmail/"
    const response = await fetch(apiUrl, requestOptions)

    switch (response.status) {
        case 200:
            serverResponse.error = false
            serverResponse.body = "Email successfully added"
            break
        case 409:
            serverResponse.error = true
            serverResponse.body = "Email already exists"
            break
        case 401:
            serverResponse.error = true
            serverResponse.body = "Not Authorized"
        default:
            serverResponse.error = true
            serverResponse.body = "An error occurred, it's probably our fault"
            break
    }

    return serverResponse
}
