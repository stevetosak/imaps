import React from "react";
import "./Footer.css";
import { Button } from "./Button";
import logo from "../../../assets/novo_logo_nobg_cropped.png";
import {Link} from "react-router-dom";

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-links">
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>Contact Us</h2>
            <a href="#">Contact</a>
            <a href="#">Support</a>
          </div>
        </div>
          <div className="social-media-wrap">

            <div className="footer-logo">
              <img src={logo} alt={"logo"}/>
            </div>
            <small className="website-rights">iMaps © {2024}</small>
          </div>
        <div>
          <div className="footer-link-wrapper">
            <div className="footer-link-items">
              <h2>Legal & Privacy</h2>
              <Link to={"/privacy-policy"}>Privacy Policy</Link>
              <Link to={"/terms-of-service"}>Terms Of Service</Link>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Footer;
