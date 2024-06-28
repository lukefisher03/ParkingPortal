// Get form data

export type LoginInfo = {
  email: string,
  password: string,
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

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export const postLoginInfo = async (body: LoginInfo):Promise<string> => {

  const apiUrl = "http://127.0.0.1:8000/accounts/login"
  let errorMessage = ""

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }

  const response = await fetch(apiUrl, requestOptions)
  const jsonResponse = await response.json()
  
  errorMessage = jsonResponse["error"]
  return errorMessage
}
