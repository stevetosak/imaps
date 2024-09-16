import React, { useState } from "react";
import styles from "./SideBar.module.css";
import menu_closed from "../../assets/menu_closed_icon.png";
import menu_opened from "../../assets/menu_opened_icon.png";

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <button className={styles.toggleBtn} onClick={toggleSidebar}>
          <img src={isOpen ? menu_opened : menu_closed} alt="Menu Toggle"></img>
        </button>
        <div className={styles.sidebarContent}>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </div>
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </div>
  );
}

export default SideBar;