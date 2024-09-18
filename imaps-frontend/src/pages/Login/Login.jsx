import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import illustration from "../../assets/illustration_img.png";
import axios from "axios";



const LoginPage = () => {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/login',{
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username,password}),
    })
    .then(data => {
      localStorage.setItem('token', data.token);
      console.log('Login successful:', data);
    })
    .catch(error => {
      console.error('Login failed', error);
    });
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.illustration}>
        <img src={illustration} alt="illustration" />
      </div>
      <div className={styles.form}>
        <div className={styles.heading}>LOGIN</div>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Username</label>
            <input type="text" 
            id="name" 
            placeholder="Enter your username" 
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" 
            id="password" 
            placeholder="Enter your password" 
            onChange={(e) => setPassword(e.target.value)} 
            value={password}
            />
          </div>
          <button type="submit">
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
export default LoginPage;
