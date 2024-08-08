import React from "react";
import "./Footer.css";
import { Button } from "./Button";
import logo from "../../../assets/logo_icon.png";

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-links">
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>Contact Us</h2>
            <a href="#">Contact</a>
            <a href="#">Support</a>
            <a href="#">Destinations</a>
            <a href="#">Sponsorships</a>
          </div>
        </div>
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>Social Media</h2>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Youtube</a>
            <a href="#">Twitter</a>
          </div>
        </div>
      </div>
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <a href="#" className="social-logo">
              iMaps
            </a>
          </div>
          <small className="website-rights">iMaps © {2024}</small>
          <div className="social-icons">
            <a className="social-icon-link facebook" href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f" />
            </a>
            <a className="social-icon-link instagram" href="#" aria-label="Instagram">
              <i className="fab fa-instagram" />
            </a>
            <a className="social-icon-link youtube" href="#" aria-label="Youtube">
              <i className="fab fa-youtube" />
            </a>
            <a className="social-icon-link twitter" href="#" aria-label="Twitter">
              <i className="fab fa-twitter" />
            </a>
            <a className="social-icon-link linkedin" href="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
