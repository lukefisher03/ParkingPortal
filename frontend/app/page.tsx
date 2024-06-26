import styles from "./page.module.css";

export default function Home() {
  return (
    <section id="signup-modal">
      <form id="form">
        <h1>Create your account</h1>
        <input
          className={styles["text-input"]}
          type="text"
          name="name"
          placeholder="Name"
        />
        <input
          className={styles["text-input"]}
          type="text"
          name="phone-number"
          placeholder="Phone Number"
        />
        <input
          className={styles["text-input"]}
          type="text"
          name="email"
          placeholder="Email"
        />
        <input
          className={styles["text-input"]}
          type="password"
          name="password"
          placeholder="Password"
        />
        <p id="login-redirect">
          Already have an account? <a href="#">Login</a>
        </p>
        <input
          className={styles["form-button"]}
          id="submit-button"
          type="button"
          value="Sign Up"
        />
      </form>
    </section>
  );
}
