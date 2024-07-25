"use server"

import { Vehicle } from "./script"

//server actions heehee

export const addVehicle = async (plate: string, nickname: string, kind: string): Promise<[string, boolean]> => {
    const apiUrl = "http://127.0.0.1:8000/api/addVehicle"
    const updateVehicleApiUrl = `http://127.0.0.1.:8000/api/updateVehicleInfo/`

    const body = {
        plate: plate,
        nickname: nickname,
        kind: kind
    }

    if (!body.plate || !body.nickname || !body.kind) {
        return ["Please fill out the entire form", false]
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
            return ["Vehicle successfully added", true]
            break;
        case 401:
            return ["Please re-authenticate to add vehicle", false]
            break;
        case 403:
            return ["Vehicle already exists in your account", false]
            break;
        case 400:
            return ["Your request could not be completed at this time, please try again later", false]
        default:
            return ["An unknown error occurred", false]
            break;
    }
}

export const removeVehicle = async (vehicle: Vehicle) => {
    const apiUrl = "http://127.0.0.1:8000/api/removeVehicle"

    const requestOptions: RequestInit = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            owner_id: vehicle.ownerId,
            vehicle_id: vehicle.vehicleId,
        })
    }


    const response = await fetch(apiUrl, requestOptions)
    console.log(response.status)
}