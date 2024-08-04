import React from "react";
import { Link } from "react-router-dom";
import illustration from "../../assets/illustration_img.png";
import styles from "./Signup.module.css";

export default function Signup() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.illustration}>
        <img src={illustration} alt="illustration" />
      </div>
      <div className={styles.form}>
        <div className={styles.heading}>CREATE AN ACCOUNT</div>
        <form>
          <div>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Enter your name" />
          </div>
          <div>
            <label htmlFor="email">E-Mail</label>
            <input type="text" id="email" placeholder="Enter your mail" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" />
          </div>
          <button type="submit">Submit</button>
          <h2 align="center" className={styles.or}>
            OR
          </h2>
        </form>
        <p>
          Have an account? <Link to="/Login"> Login </Link>
        </p>
      </div>
    </div>
  );
}
