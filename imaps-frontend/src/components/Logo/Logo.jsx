import React from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo_icon.png";
import styles from "./Logo.module.css";

function Logo({ position = "fixed" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div
      className={position === "fixed" ? styles.fixedLogoContainer : styles.inlineLogoContainer}
      onClick={handleClick}
    >
      <img src={logoImage} alt="Logo" className={styles.logoImage} />
    </div>
  );
}

export default Logo;
