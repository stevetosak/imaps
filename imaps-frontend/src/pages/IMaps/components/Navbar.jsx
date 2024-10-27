import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo_icon.png";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

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

  window.addEventListener("resize", showButton);

  return (
      <nav className="navbar">
        <div className="navbar-container">
          <a href="#" className="navbar-logo pad-bot" onClick={closeMobileMenu}>
            iMaps
          </a>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <Link to="/Signup">
              <li className="nav-item">
                <a href="#" className="nav-links" onClick={closeMobileMenu}>
                  SignUp
                </a>
              </li>
            </Link>
          </ul>
          <div className="pad-bot">
            <Link to="/Login">{button && <Button buttonStyle="btn--outline">LOG IN</Button>}</Link>
          </div>
        </div>
      </nav>
  );
}

export default Navbar;
