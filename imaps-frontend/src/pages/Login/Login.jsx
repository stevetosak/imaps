import React, {useContext, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import styles from "./Login.module.css";
import illustration from "../../assets/illustration_img.png";
import {AuthContext} from "../../components/AuthContext/AuthContext.jsx";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { handleLogin } = useContext(AuthContext);

  const { targetPath } = location.state || { targetPath: { pathname: "/" } };

  const payload = {
    username: username,
    password: password
  };

  const login = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed: resp = " + response.statusText); 
        }
        return response.json();
      })
      .then((data) => {
        if (data.token) {
          navigate(targetPath)
          handleLogin(data)
        } else {
          setError("Invalid username or password.");
        }
      })
      .catch((error) => {
        console.error("Login failed", error);
        setError("Login failed. Please try again.");
      });
    
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.illustration}>
        <img src={illustration} alt="illustration" />
      </div>
      <div className={styles.form}>
        <div className={styles.heading}>LOGIN</div>
        <form onSubmit={login}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">Submit</button>
        </form>
        <p>
          Don't have an account? <Link to="/Signup"> Sign Up </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
