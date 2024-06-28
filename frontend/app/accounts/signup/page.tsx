"use client";

import { Dispatch, SetStateAction, useState } from "react";
import styles from "./page.module.css";
import { SignupInfo, validateSignupInfo, postSignupInfo } from "./script";

const SubmitButton = (props: { signupInfo: SignupInfo, errorSetter: Dispatch<SetStateAction<string>>}) => {
  function handleSubmit(event: React.MouseEvent) {
    event.preventDefault();

    // remove any non number characters from the phone number
    props.signupInfo.phone_number = props.signupInfo.phone_number.replace(
      /\D/g,
      ""
    );

    const errors = validateSignupInfo(props.signupInfo)

    if (!errors) {
      postSignupInfo(props.signupInfo)
      

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
  );
};

export default function SignupModal() {
  const [formInput, setFormInput] = useState<SignupInfo>({ // initalize empty object
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
        <p className={styles["signup-errors"]}>{errors}</p>
        <p className={styles["login-redirect"]}>
          Already have an account? <a href="#">Login</a>
        </p>
        <SubmitButton signupInfo={formInput} errorSetter={setErrors}/>
      </form>
    </section>
  );
}
