import React from "react";
import PropTypes from "prop-types";
import styles from "./Toast.module.css";

const Toast = ({ message, type, onClose }) => {
    return (
        <div
            className={`${styles.toast} ${type === 1 ? styles.success : styles.error}`}
            onClick={onClose}
        >
            {message}
        </div>
    );
};



export default Toast;
