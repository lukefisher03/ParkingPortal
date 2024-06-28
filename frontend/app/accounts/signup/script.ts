// Get form data

export type SignupInfo = {
    name: string,
    email: string,
    password: string,
    phone_number:string
}

type FormOutput = {
  body: SignupInfo,
  errors: string | null
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

// submitButton!.addEventListener("click", () => {
//   const formData = new FormData(form)
//   const formOutput = parseInput(formData)

//   if (formOutput.errors) {
//     console.error(`Errors were found!\n\n${formOutput.errors}`)
//   } else {
//     postSignupInfo(formOutput.body)
//   }
// })

export const postSignupInfo = (body: SignupInfo) => {
  const apiUrl = "http://127.0.0.1:8000/accounts/signup"

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }

  fetch(apiUrl, requestOptions)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      console.log(JSON.stringify(data, null, 2))
    }).catch((reason) => {
      console.log("Error, data could not be posted")
    })
}
