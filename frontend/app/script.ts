// Get form data

const form = <HTMLFormElement>document.getElementById("form")
const submitButton = document.getElementById("submit-button")

type SignupInfo = {
    name: string,
    email: string,
    password_hash: string,
    phone_number:string
}

type FormOutput = {
  body: SignupInfo,
  errors: string | null
}

const parseInput = (formData: FormData):FormOutput => {
  let errorMessage = ""
  const formOutput:Partial<FormOutput> = {}
  const signupInfo: Partial<SignupInfo> = {}

  for (let [key, value] of formData.entries()) {
    value = value.toString()
    switch (key) {
      case "name":
        if (value == "") {
          errorMessage += "Name cannot be blank\n"
        } else {
          console.log(`Name ${value}`)
          signupInfo["name"] = value
        }
        break
      case "email":
        if (!validateEmail(value)) {
          errorMessage += "Email is invalid\n"
        } else {
          console.log(`Email ${value}`)
          signupInfo["email"] = value
        }
        break
      case "password":
        if (value.length < 8) {
          errorMessage += "Password must be longer than 8 characters\n"
        } else {
          //TODO: Hash the password
          console.log(`Password ${value}`)
          signupInfo["password_hash"] = value
        }
        break
      case "phone-number":
        const strippedString = value.replace(/\D/g, "")
        if (strippedString.length < 10) {
          errorMessage += "Phone number is not long enough\n"
        } else {
          console.log(`phone-number ${strippedString}`)
          signupInfo["phone_number"] = strippedString
        }
        console.log(`Phone Number ${value}`)
        break
    }
  }

  formOutput["body"] = signupInfo as SignupInfo

  if (errorMessage.length >= 0) {
    console.error(errorMessage)
    formOutput["errors"] = errorMessage
    return formOutput as FormOutput
  } else {
    console.log("All form input data looks good")
    return formOutput as FormOutput
  }
}

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

submitButton!.addEventListener("click", () => {
  const formData = new FormData(form)
  const formOutput = parseInput(formData)

  if (formOutput.errors) {
    console.error(`Errors were found!\n\n${formOutput.errors}`)
  } else {
    postSignupInfo(formOutput.body)
  }
})

const postSignupInfo = (body: SignupInfo) => {
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
      console.log("Got here!")
      return response.json()
    })
    .then((data) => {
      console.log(JSON.stringify(data, null, 2))
    })
}

export {}