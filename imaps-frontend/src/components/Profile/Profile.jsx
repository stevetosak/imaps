import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../../assets/person_icon.png";
import styles from "./Profile.module.css";
import { AuthContext } from "../../components/AuthContext/AuthContext.jsx";

function Profile({ position = "fixed" }) {
  const menus = ["My Maps", "Logout"];
  const { username } = useContext(AuthContext); // Get username from AuthContext
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const imgRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && imgRef.current) {
        if (!menuRef.current.contains(e.target) && !imgRef.current.contains(e.target)) {
          setOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleMenuClick = (menu) => {
    if (menu === "My Maps") {
      navigate("/MyMaps");
    } else if (menu === "Logout") {
      localStorage.removeItem("token");
      window.location.reload();
    }
    setOpen(false);
  };

  return (
    <div className={position === "fixed" ? styles.fixedProfileContainer : styles.inlineProfileContainer}>
      <div className={styles.profileWrapper}>
        <img
          onClick={() => setOpen(!open)}
          src={profile}
          alt="profile"
          className={styles.profileImage}
          ref={imgRef}
        />
        {open && (
          <div ref={menuRef} className={styles.dropdownMenu}>
            <div className={styles.username}>{username}</div>
            <ul className={styles.menuList}>
              {menus.map((menu) => (
                <li key={menu} onClick={() => handleMenuClick(menu)} className={styles.menuItem}>
                  {menu}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
