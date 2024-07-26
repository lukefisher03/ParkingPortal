"use server"

import { cookies } from "next/headers"
import { jsonToVehicle } from "./utils"
import { ServerResponse } from "./utils"
export type CitationInfo = {
  citationNumber: string,
  location: string,
  plate: string,
  vin: string,
  issueDate: string,
  due_date: string,
  status: string,
  amount_due: string,
  citation_link: string
}

export type User = {
  userId: string,
  name: string,
  email: string,
  phoneNumber: string
}

export type Vehicle = {
  plate: string,
  userId: string,
  vehicleId: string,
  nickname: string,
  kind: string

}

export const getCitationInfo = async (plate: string): Promise<CitationInfo[]> => {
  const apiUrl = `http://127.0.0.1:8000/api/getCitations/?plate=${plate.toUpperCase()}` // ALL API CALLS USE UPPER CASE FOR QUERY PARAMS
  // let errorMessage = ""

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache"
  }

  const response = await fetch(apiUrl, requestOptions)
  const jsonResponse = await response.json()
  return jsonResponse as CitationInfo[]
}

type UserInfoServerResponse = ServerResponse & {
  user: User
}

export const getUserInfo = async (): Promise<UserInfoServerResponse> => {
  const serverResponse: UserInfoServerResponse = {
    error: false,
    body: "",
    user: {
      userId: "",
      name: "",
      email: "",
      phoneNumber: ""
    }
  }
  const cookieStore = cookies()
  const userId = cookieStore.get("userId")?.value

  if (!userId) {
    serverResponse.error = true
    serverResponse.body = "No logged in user"
    return serverResponse
  }

  const apiUrl = `http://127.0.0.1:8000/api/getUser/?user_id=${userId}`

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache"
  }

  const response = await fetch(apiUrl, requestOptions)
  const jsonResponse = await response.json()

  if (response.status == 401) {
    serverResponse.error = true
    serverResponse.body = "No logged in user"
    cookieStore.delete("userId")
    return serverResponse
  }
  
  serverResponse.user = {
      userId: jsonResponse["user_id"],
      name: jsonResponse["name"],
      email: jsonResponse["email"],
      phoneNumber: jsonResponse["phone_number"]
  }

  serverResponse.body = "Success"
  serverResponse.error = false
  


  return serverResponse
}


export const getVehicle = async (plate: string): Promise<Vehicle> => {
  const cookieStore = cookies()
  const apiUrl = `http://127.0.0.1:8000/api/getVehicle/?plate=${plate.toUpperCase()}&user_id=${cookieStore.get("userId")?.value}` // error-handling
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache"
  }

  const response = await fetch(apiUrl, requestOptions)
  const jsonResponse = await response.json()
  return jsonToVehicle(jsonResponse)
}


export const getUserVehicles = async (userId: string): Promise<Vehicle[]> => {
  const apiUrl = `http://127.0.0.1:8000/api/getVehicles/?user_id=${userId}`

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache"
  }

  const response = await fetch(apiUrl, requestOptions)
  const jsonResponse = await response.json()
  let vehicles: Vehicle[] = []

  for (const v of jsonResponse) {
    vehicles.push(jsonToVehicle(v))
  }

  return vehicles
}

