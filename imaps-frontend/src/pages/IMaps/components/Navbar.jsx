import React, { useState, useEffect, useContext } from "react";
import { Button } from "./Button";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo_icon from "../../../assets/logo_icon.png";
import { AuthContext } from "../../../components/AuthContext/AuthContext";
import Logo from "../../../components/Logo/Logo.jsx";
import Profile from "../../../components/Profile/Profile.jsx";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const { isAuthenticated } = useContext(AuthContext);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", showButton);
    return () => window.removeEventListener("resize", showButton);
  }, []);

  return (
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navlogoCont">
            <Logo position="relative" />
            <h1>iMAPS</h1>
          </div>

          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>

          <div className={click ? "nav-menu active" : "nav-menu"}></div>

          <div className="linkCont">
            {isAuthenticated ? (
                <Profile position='inline'/>
            ) : (
                <>
                  <div className="signup">
                    <Link to="/Signup">
                      {button && <Button buttonStyle="btn--outline">SIGN UP</Button>}
                    </Link>
                  </div>
                  <div className="login">
                    <Link to="/Login">
                      {button && <Button buttonStyle="btn--outline">LOG IN</Button>}
                    </Link>
                  </div>
                </>
            )}
          </div>
        </div>
      </nav>
  );
}

export default Navbar;
