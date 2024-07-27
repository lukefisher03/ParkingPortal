"use client"

import { Dispatch, SetStateAction, useState } from "react"
import styles from "../layout.module.css"
import { SignupInfo, validateSignupInfo } from "../script"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { postSignupInfo } from "../auth"

const SubmitButton = (props: {
  signupInfo: SignupInfo
  errorSetter: Dispatch<SetStateAction<string>>
}) => {
  const router = useRouter()
  
  async function handleSubmit(event: React.MouseEvent) {
    event.preventDefault()

    // remove any non number characters from the phone number
    props.signupInfo.phone_number = props.signupInfo.phone_number.replace(
      /\D/g,
      ""
    )

    const errors = validateSignupInfo(props.signupInfo)

    if (!errors) {
      const serverError = await postSignupInfo(props.signupInfo)
      if (serverError.error) {
        props.errorSetter(serverError.responseMessage)
      } else {
        localStorage.setItem("userId", serverError.responseMessage)
        router.push("/dashboard")
      }
    } else {
      props.errorSetter(errors)
    }
  }

  return (
    <input
      className={styles["form-button"]}
      id="submit-button"
      type="button"
      value="Sign Up"
      onClick={handleSubmit}
    />
  )
}

export default function SignupModal() {
  const [formInput, setFormInput] = useState<SignupInfo>({
    // initalize empty object
    email: "",
    phone_number: "",
    password: "",
    name: "",
  })

  const [errors, setErrors] = useState<string>("")

  return (
    <section className={styles["account-modal"]}>
      <form id="form">
        <h1>Create your account</h1>
        <input
          className={styles["text-input"]}
          type="text"
          name="name"
          placeholder="Name"
          onChange={(e) =>
            setFormInput({ ...formInput, name: e.target.value.toString() })
          }
        />
        <input
          className={styles["text-input"]}
          type="text"
          name="phone-number"
          placeholder="Phone Number"
          onChange={(e) =>
            setFormInput({
              ...formInput,
              phone_number: e.target.value.toString(),
            })
          }
        />
        <input
          className={styles["text-input"]}
          type="text"
          name="email"
          placeholder="Email"
          onChange={(e) =>
            setFormInput({ ...formInput, email: e.target.value.toString() })
          }
        />
        <input
          className={styles["text-input"]}
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) =>
            setFormInput({
              ...formInput,
              password: e.target.value.toString(),
            })
          }
        />
        <p className={styles["errors"]}>{errors}</p>
        <p className={styles["login-redirect"]}>
          Already have an account? <Link href="login">Login</Link>
        </p>
        <SubmitButton signupInfo={formInput} errorSetter={setErrors} />
      </form>
    </section>
  )
}
