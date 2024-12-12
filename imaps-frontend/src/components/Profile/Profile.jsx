import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import profile from "../../assets/person_icon.png";
import styles from "./Profile.module.css";
import { useAppContext } from "../AppContext/AppContext.jsx";

function Profile({ position = "fixed" }) {
    const { username, isAuthenticated } = useAppContext();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const imgRef = useRef(null);
    const navigate = useNavigate();

    const menus = isAuthenticated ? ["My Maps", "Logout"] : ["Login"];

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
                <div className={styles.profileIconContainer} onClick={() => setOpen(!open)}>
                    <img src={profile} alt="profile" className={styles.profileImage} ref={imgRef} />
                </div>
                {open && (
                    <div ref={menuRef} className={styles.dropdownMenu}>
                        {isAuthenticated && <div className={styles.username}>{username}</div>}
                        <ul className={styles.menuList}>
                            {menus.map((menu) =>
                                menu === "Login" ? (
                                    <li key={menu} className={styles.menuItem}>
                                        <Link to="/login" className={styles.linkStyle}>{menu}</Link>
                                    </li>
                                ) : (
                                    <li key={menu} onClick={() => handleMenuClick(menu)} className={styles.menuItem}>
                                        {menu}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
