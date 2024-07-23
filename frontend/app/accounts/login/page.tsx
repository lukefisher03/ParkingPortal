"use client"

import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import styles from "../layout.module.css"
import { LoginInfo, validateLoginInfo, postLoginInfo } from "./script"
import Link from "next/link"
import { useRouter } from "next/navigation"


const SubmitButton = (props: {
  loginInfo: LoginInfo
  errorSetter: Dispatch<SetStateAction<string>>
}) => {
  const router = useRouter()

  async function handleSubmit(event: React.MouseEvent) {
    event.preventDefault()

    const errors = validateLoginInfo(props.loginInfo)
    props.errorSetter("")

    if (!errors) {
      const serverError = await postLoginInfo(props.loginInfo)
      if (serverError.error) {
        props.errorSetter(serverError.responseMessage)
      } else {
        localStorage.setItem("userId", serverError.responseMessage)
        console.log("Successfully authenticated")
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
      value="Login"
      onClick={handleSubmit}
    />
  )
}

export default function LoginModal() {
  const [formInput, setFormInput] = useState<LoginInfo>({
    // initalize empty object
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState<string>("")

  return (
    <section className={styles["account-modal"]}>
      <form id="form">
        <h1>Parking Portal</h1>
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
        <p className={styles["redirect"]}>
          Don't have an account? <Link href="signup">Sign up</Link>
        </p>
        <SubmitButton loginInfo={formInput} errorSetter={setErrors} />
      </form>
    </section>
  )
}
