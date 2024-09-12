import React from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import illustration from "../../assets/illustration_img.png";

const preventRefresh = (e) => {
  e.preventDefault();
};

function Login() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.illustration}>
        <img src={illustration} alt="illustration" />
      </div>
      <div className={styles.form}>
        <div className={styles.heading}>LOGIN</div>
        <form>
          <div>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Enter your name" />
          </div>
          <div>
            <label htmlFor="email">E-Mail</label>
            <input type="email" id="email" placeholder="Enter your mail" />
          </div>
          <button type="submit" onClick={preventRefresh}>
            Submit
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/Signup"> Sign Up </Link>
        </p>
      </div>
    </div>
  );
}
export default Login;
