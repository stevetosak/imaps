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
    <div className="flex h-screen justify-center bg-gray-200 pt-16">
      <div className="relative">
        <img
          onClick={() => setOpen(!open)}
          src={profile}
          alt="profile"
          className="h-20 w-20 cursor-pointer rounded-full border-4 border-gray-300 object-cover "
        />
        {open && (
          <div ref={menuRef} className="absolute -left-14 top-24 w-52 bg-white p-4 shadow-lg">
            <ul className={styles.menuList}>
              {menus.map((menu) => (
                <li key={menu} onClick={() => setOpen(false)} className={`${styles.menuItem}`}>
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
