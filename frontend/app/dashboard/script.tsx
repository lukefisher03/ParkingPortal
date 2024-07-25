"use server"

import { cookies } from "next/headers"
import { jsonToVehicle } from "./utils"
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
  ownerId: string,
  vehicleId: string,
  nickname: string,
  kind: string

}

export const getCitationInfo = async (plate: string): Promise<CitationInfo[]> => {
  const apiUrl = `http://127.0.0.1:8000/api/getCitations/${plate.toUpperCase()}` // ALL API CALLS USE UPPER CASE FOR QUERY PARAMS
  // let errorMessage = ""

  const requestOptions:RequestInit = {
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

export const getUserInfo = async (userId: string): Promise<User> => {
  const apiUrl = `http://127.0.0.1:8000/api/getUser/${userId}`
  
  const requestOptions:RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache"
  }

  const response = await fetch(apiUrl, requestOptions)
  const jsonResponse = await response.json()

  const user: User = {
    userId: jsonResponse["id"],
    name: jsonResponse["name"],
    email: jsonResponse["email"],
    phoneNumber: jsonResponse["phone_number"]
  }

  return user
}


export const getVehicle = async (plate: string): Promise<Vehicle> => {
  const cookieStore = cookies()
  const apiUrl = `http://127.0.0.1:8000/api/getVehicle/?plate=${plate.toUpperCase()}&owner_id=${cookieStore.get("userId")?.value}` // error-handling
  console.log(apiUrl)
  const requestOptions:RequestInit = {
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
  const apiUrl = `http://127.0.0.1:8000/api/getVehicles/${userId}`
  
  const requestOptions:RequestInit = {
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

