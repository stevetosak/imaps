import React, {useContext, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import styles from "./Login.module.css";
import illustration from "../../assets/illustration_img.png";
import Logo from "../../components/Logo/Logo.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import {useAppContext} from "../../components/AppContext/AppContext.jsx";
import config from "../../scripts/net/netconfig.js";
import facebook_icon from "../../assets/facebook_icon.png";
import gmail_icon from "../../assets/gmail_icon.png";

const LoginPage = () => {
    const [formUsername, setFormUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const {setUsername, setIsAuthenticated} = useAppContext();

    const {targetPath} = location.state || {targetPath: {pathname: "/"}};

    const payload = {
        username: formUsername,
        password: password,
    };

    const handleLogin = async () => {
        const httpService = new HttpService();
        return httpService.post(config.auth.login, payload);
    };

    const login = async (e) => {
        e.preventDefault();

        handleLogin()
            .then(resp => {
                if (resp.token) {
                    navigate(targetPath);
                    localStorage.setItem("token", resp.token);
                    setUsername(resp.username);
                    setIsAuthenticated(true);
                    console.log("ROLES", resp.roles);
                } else {
                    setError("Invalid username or password.");
                }
            }).catch(reason => {
            console.error("Login failed", reason);
            setError("Login failed. Please try again.");
        });
    };

    const continueWithGoogle = () => {
        console.log("Continue with Google");
        // Add logic for Google authentication here
    };

    const continueWithFacebook = () => {
        console.log("Continue with Facebook");
        // Add logic for Facebook authentication here
    };

    return (
        <div className={styles.wrapper}>
            <Logo></Logo>
            <div className={styles.illustration}>
                <img src={illustration} alt="illustration"/>
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
                            onChange={(e) => setFormUsername(e.target.value)}
                            value={formUsername}
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
                <div className={styles.or}>OR</div>
                <div className={styles.socialButtons}>
                    <button className={styles.socialButton} onClick={continueWithGoogle}>
                        <img src={gmail_icon} alt="Google Icon" className={styles.socialIcon} />
                        Continue with Google
                    </button>
                    <button className={styles.socialButton} onClick={continueWithFacebook}>
                        <img src={facebook_icon} alt="Facebook Icon" className={styles.socialIcon} />
                        Continue with Facebook
                    </button>
                </div>
                <p>
                    Don't have an account? <Link to="/Signup"> Sign Up </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;