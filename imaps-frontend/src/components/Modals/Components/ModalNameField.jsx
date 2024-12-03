import styles from "../EntranceModal/EntranceModal.module.css";
import React from "react";

export default function ModalNameField({shapeInfo,updateModalData,phtext}) {
    return (
        <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
                type="text"
                id="name"
                name="name"
                value={shapeInfo.name}
                onChange={updateModalData}
                placeholder={phtext}
                required
            />
        </div>
    )
}