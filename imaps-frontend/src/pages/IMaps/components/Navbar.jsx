import React, {useContext, useState} from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../components/AuthContext/AuthContext";
import Logo from "../../../components/Logo/Logo.jsx";
import Profile from "../../../components/Profile/Profile.jsx";
import {useAppContext} from "../../../components/AppContext/AppContext.jsx";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const { isAuthenticated } = useAppContext();

    return (
        <nav className="modern-navbar">
            <div className="navbar-container">
                {/* Left Section - Logo and Title */}
                <div className="navbar-left">
                    <Logo position="relative"/>
                    <h1 className="navbar-title">iMaps</h1>
                </div>

                {/* Right Section - Login/Signup or Profile */}
                <div className="navbar-right">
                    {isAuthenticated ? (
                        <Profile position="relative"/>
                    ) : (
                        <>
                            <Link to="/Login" className="navbar-btn navbar-login">
                                Log In
                            </Link>
                            <Link to="/Signup" className="navbar-btn navbar-signup">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
