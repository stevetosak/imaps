import React, {useContext, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import styles from "./Login.module.css";
import illustration from "../../assets/illustration_img.png";
import Logo from "../../components/Logo/Logo.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import {useAppContext} from "../../components/AppContext/AppContext.jsx";
import config, {API_BASE_URL} from "../../scripts/net/netconfig.js";
import google_icon from "../../assets/Logo-google-icon-PNG.png"
import github_icon from "../../assets/github-mark-white.png";
import { v4 as uuidv4 } from 'uuid';

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

    const continueWithGitHub = async () => {
        const httpService = new HttpService();
        httpService.setResponseType('text');
        const state = await httpService.get(config.auth.oauth.github.state)
        const clientId = 'Iv23liqzhX5wMYNDHtnz';
        const redirectUri = encodeURI(`${API_BASE_URL}/oauth/callback`);

        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURI(clientId)}&redirect_uri=${redirectUri}&state=${encodeURI(state)}&scope=user:email`;

        window.location.href = githubAuthUrl;

    };

    const continueWithFacebook = () => {
        console.log("Continue with Facebook");
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
                    <button className={styles.socialButton} onClick={continueWithFacebook}>
                        <img src={google_icon} alt="Facebook Icon" className={styles.socialIcon}/>
                        Sign In With Google
                    </button>
                    <button className={styles.socialButton} onClick={continueWithGitHub}>
                        <img src={github_icon} alt="GitHub Icon" className={styles.socialIcon}/>
                        Sign In With GitHub
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