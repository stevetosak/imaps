import React, { useState } from "react";
import styles from "./SideBar.module.css";
import menu_closed from "../../assets/menu_closed_icon.png";
import menu_opened from "../../assets/menu_opened_icon.png";
import { Link } from "react-router-dom";

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <button className={styles.toggleBtn} onClick={toggleSidebar}>
          <img src={isOpen ? menu_opened : menu_closed} alt="Menu Toggle" />
        </button>
        <div className={styles.sidebarContent}>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Maps">Maps</Link>
            </li>
            <li>
              <Link to="/Maps/FinkiMaps/Draw">Draw</Link>
            </li>
          </ul>
        </div>
      </div>
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </div>
  );
}

export default SideBar;
