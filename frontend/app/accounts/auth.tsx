"use server"

//making server actions because my setup is actually awful.

import { LoginInfo, SignupInfo } from "./script"
import { cookies } from "next/headers"

export const postLoginInfo = async (body: LoginInfo): Promise<{ error: boolean, responseMessage: string }> => {
    const cookieStore = cookies()
    const apiUrl = "http://127.0.0.1:8000/accounts/login/"
    let error = false
    let responseMessage = ""
  
    const requestOptions:RequestInit = {
      method: "POST",
      mode:"cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include"
    }
  
    const response = await fetch(apiUrl, requestOptions)
    const jsonResponse = await response.json()
    if (jsonResponse["error"]) {
      responseMessage = jsonResponse["error"]
      error = true
    } else {
      responseMessage = jsonResponse["userId"]
      cookieStore.set("userId", responseMessage)
    }
  
    return { error: error, responseMessage: responseMessage }
  }
  
  
  export const postSignupInfo = async (body: SignupInfo): Promise<{ error: boolean, responseMessage: string }> => {
  
    const apiUrl = "http://127.0.0.1:8000/accounts/signup/"
    const cookieStore = cookies()

    let responseMessage = ""
    let error = false
    const requestOptions:RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials:"include"
    }
  
    const response = await fetch(apiUrl, requestOptions)
    const jsonResponse = await response.json()
    if (await jsonResponse["error"]) {
      error = true
      responseMessage = await jsonResponse["error"]
    } else {
      responseMessage = await jsonResponse["user_id"]
      cookieStore.set("userId", responseMessage)
    }

    return { error: error, responseMessage: responseMessage }
  }
  