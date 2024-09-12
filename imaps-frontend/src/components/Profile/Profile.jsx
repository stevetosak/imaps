import React, { useState, useRef, useEffect } from "react";
import profile from "../../assets/person_icon.png";
import styles from "./Profile.module.css";

function Profile() {
  const menus = ["Profile", "Settings", "Support", "Logout"];
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const imgRef = useRef(null);

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

  return (
    <div className={styles.profileContainer}>
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
            <ul className={styles.menuList}>
              {menus.map((menu) => (
                <li key={menu} onClick={() => setOpen(false)} className={styles.menuItem}>
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
