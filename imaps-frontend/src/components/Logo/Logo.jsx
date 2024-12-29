import React from "react";
import { useNavigate } from "react-router-dom";
import novo_logo from "../../assets/novo_logo_nobg_cropped.png";
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
      <img src={novo_logo} alt="Logo" className={styles.logoImage} />
    </div>
  );
}

export default Logo;
