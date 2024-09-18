import React, { useState } from "react";
import { Link } from "react-router-dom";
import illustration from "../../assets/illustration_img.png";
import styles from "./Signup.module.css";

export default function Signup() {
  // State to store form input values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Create payload to send to the backend
    const payload = {
      name: name,
      email: email,
      password: password,
    };

    try {
      // Send a POST request to the backend
      const response = await fetch("http://localhost:8080/api/v1/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Convert the payload to JSON
      });

      if (response.ok) {
        setMessage("User registered successfully!");
      } else if (response.status === 409) {
        setMessage("Email is already taken.");
      } else {
        setMessage("Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error registering user.");
    }
  };

  return (
      <div className={styles.wrapper}>
        <div className={styles.illustration}>
          <img src={illustration} alt="illustration" />
        </div>
        <div className={styles.form}>
          <div className={styles.heading}>CREATE AN ACCOUNT</div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name</label>
              <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)} // Update name state
                  placeholder="Enter your name"
                  required
              />
            </div>
            <div>
              <label htmlFor="email">E-Mail</label>
              <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state
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
                  onChange={(e) => setPassword(e.target.value)} // Update password state
                  placeholder="Enter your password"
                  required
              />
            </div>
            <button type="submit">Submit</button>
            {message && <p>{message}</p>} {/* Display feedback message */}
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
