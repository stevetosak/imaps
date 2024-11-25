import styles from "../EntranceModal/EntranceModal.module.css";
import React from "react";

export default function ModalNameField({formData,updateModalData,phtext}) {
    return (
        <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={updateModalData}
                placeholder={phtext}
                required
            />
        </div>
    )
}