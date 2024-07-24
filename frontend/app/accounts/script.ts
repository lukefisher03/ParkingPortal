// Get form data
export type LoginInfo = {
  email: string,
  password: string,
}

export type SignupInfo = {
  name: string,
  email: string,
  password: string,
  phone_number: string
}

export const validateLoginInfo = (signupInfo: LoginInfo): string => {
  let errorMessage = ""

  if (!validateEmail(signupInfo["email"])) {
    errorMessage += "Email is invalid\n"
  }

  if (signupInfo["password"].length < 8) {
    errorMessage += "Password must be at least 8 characters\n"
  }

  return errorMessage
}

export const validateSignupInfo = (signupInfo: SignupInfo): string => {
  let errorMessage = ""

  if (signupInfo["name"] == "" || !signupInfo) {
    errorMessage += "Name cannot be blank\n"
  }

  if (!validateEmail(signupInfo["email"])) {
    errorMessage += "Email is invalid\n"
  }

  if (signupInfo["password"].length < 8) {
    errorMessage += "Password must be at least 8 characters\n"
  }

  if (signupInfo["phone_number"].length < 10) {
    errorMessage += "Phone number must be at least 10 digits\n"
  }

  return errorMessage
}

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export const postLoginInfo = async (body: LoginInfo): Promise<{ error: boolean, responseMessage: string }> => {

  const apiUrl = "http://127.0.0.1:8000/accounts/login"
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
  }

  return { error: error, responseMessage: responseMessage }
}


export const postSignupInfo = async (body: SignupInfo): Promise<{ error: boolean, responseMessage: string }> => {

  const apiUrl = "http://127.0.0.1:8000/accounts/signup"
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

  if (jsonResponse["error"]) {
    error = true
    responseMessage = jsonResponse["error"]
  } else {
    responseMessage = jsonResponse["userId"]
  }
  return { error: error, responseMessage: responseMessage }
}
