import styles from "../EntranceModal/EntranceModal.module.css";
import React, { useRef } from "react";

export default function ModalUploadRoomImage() {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className={styles.formGroup}>
            <label htmlFor="name">Room Image</label>
            <div className={styles.customFileInput}>
                <button
                    type="button"
                    className={styles.uploadButton}
                    onClick={handleClick}
                >
                    Upload Image
                </button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                />
            </div>
        </div>
    );
}
