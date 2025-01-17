import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import illustration from "../../assets/illustration_img.png";
import styles from "./Signup.module.css";
import Logo from "../../components/Logo/Logo";
import netconfig from "../../scripts/net/netconfig.js";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match.");
      return;
    }

    const payload = {
      username: name,
      email: email,
      password: password,
    };

    try {
      const response = await fetch(netconfig.auth.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessageType("success");
        setMessage("User registered successfully!");

        // Wait 3 seconds and then redirect to login page
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (response.status === 409) {
        setMessageType("error");
        setMessage("Email is already taken.");
      } else {
        setMessageType("error");
        setMessage("Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessageType("error");
      setMessage("Error registering user.");
    }
  };

  return (
      <div className={styles.wrapper}>
        <Logo></Logo>
        <div className={styles.illustration}>
          <img src={illustration} alt="illustration" />
        </div>
        <div className={styles.form}>
          <div className={styles.heading}>CREATE AN ACCOUNT</div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Username</label>
              <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your username"
                  required
              />
            </div>
            <div>
              <label htmlFor="email">E-Mail</label>
              <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
              />
            </div>
            <button type="submit">Submit</button>
            {message && (
                <p className={messageType === "success" ? styles.successMessage : styles.errorMessage}>
                  {message}
                </p>
            )}
          </form>
          <p>
            Have an account? <Link to="/Login"> Login </Link>
          </p>
        </div>
      </div>
  );
}
