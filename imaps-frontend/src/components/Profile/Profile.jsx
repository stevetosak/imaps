import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import profile from "../../assets/person_icon.png";
import styles from "./Profile.module.css";
import { useAppContext } from "../AppContext/AppContext.jsx";

function Profile({ position = "fixed" }) {
    const { username, isAuthenticated } = useAppContext();
    const [open, setOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const imgRef = useRef(null);
    const navigate = useNavigate();

    const menus = isAuthenticated ? ["My Maps", "Logout"] : ["Login"];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (imgRef.current && !imgRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        if (imgRef.current) {
            const rect = imgRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
            });
        }
        setOpen(!open);
    };

    const handleMenuClick = (menu) => {
        if (menu === "My Maps") {
            navigate("/MyMaps");
        } else if (menu === "Logout") {
            localStorage.removeItem("token");
            window.location.reload();
        } else if (menu === "Login") {
            navigate("/Login");
        }
        setOpen(false);
    };

    const renderDropdown = () => {
        if (!open) return null;

        return ReactDOM.createPortal(
            <div
                className={styles.dropdownMenu}
                style={{
                    position: "absolute",
                    top: menuPosition.top,
                    left: menuPosition.left,
                }}
            >
                {isAuthenticated && <div className={styles.username}>{username}</div>}
                <ul className={styles.menuList}>
                    {menus.map((menu) => (
                        <li
                            key={menu}
                            className={styles.menuItem}
                            onClick={() => handleMenuClick(menu)}
                        >
                            {menu}
                        </li>
                    ))}
                </ul>
            </div>,
            document.body
        );
    };

    return (
        <div
            className={
                position === "fixed" ? styles.fixedProfileContainer : styles.inlineProfileContainer
            }
        >
            <div className={styles.profileWrapper}>
                <div
                    className={styles.profileIconContainer}
                    onClick={toggleMenu}
                    ref={imgRef}
                >
                    <img src={profile} alt="profile" className={styles.profileImage} />
                </div>
                {renderDropdown()}
            </div>
        </div>
    );
}

export default Profile;
