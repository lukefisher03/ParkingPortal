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
  dueDate: string,
  status: string,
  amountDue: string,
  citationLink: string
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

export type CitationInfoServerResponse = ServerResponse & {
  citationList: CitationInfo[]
}

export const getCitationInfo = async (plate: string): Promise<CitationInfoServerResponse> => {
  const serverResponse: CitationInfoServerResponse = {
    error: false,
    body: "",
    citationList: []
  }

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
  switch (response.status) {
    case 200:
      serverResponse.body = "Success"
      for (const citation of jsonResponse) {
        serverResponse.citationList = [
          ...serverResponse.citationList,
          { 
            citationNumber: citation["citation_number"], 
            location: citation["location"],
            plate: citation["plate"],
            vin: citation["vin"],
            issueDate: citation["issue_date"],
            dueDate: citation["due_date"],
            status: citation["status"],
            amountDue: citation["amount_due"],
            citationLink: citation["citation_link"]
          } as CitationInfo
        ]
      }
      break
    case 401:
      serverResponse.error = true
      serverResponse.body = "Not Authorized"
      break
    case 404:
      serverResponse.error = true
      serverResponse.body = "No citations found"
    default:
      serverResponse.error = true
      serverResponse.body = "An unknown error occurred, probably on our end"
      break;
  }

  return serverResponse
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

export type GetVehicleResponse = ServerResponse & {
  vehicle: Vehicle
}

export const getVehicle = async (plate: string): Promise<GetVehicleResponse> => {
  const serverResponse: GetVehicleResponse = {
    error: true,
    body: "",
    vehicle: {
      vehicleId: "",
      plate: "",
      userId: "",
      kind: "",
      nickname: ""
    }
  }
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
  switch (response.status) {
    case 200:
      serverResponse.body = "Success"
      serverResponse.vehicle = jsonToVehicle(await response.json())
      break
    case 401:
      serverResponse.error = true
      serverResponse.body = "Not Authorized"
      break
    case 404:
      serverResponse.error = true
      serverResponse.body = "No citations found"
    default:
      serverResponse.error = true
      serverResponse.body = "An unknown error occurred, probably on our end"
      break;
  }

  return serverResponse
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

