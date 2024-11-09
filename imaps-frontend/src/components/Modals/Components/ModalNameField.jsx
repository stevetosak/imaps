import styles from "../EntranceModal/EntranceModal.module.css";
import React from "react";

export default function ModalNameField({formData,updateModalData}) {
    return (
        <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={updateModalData}
                placeholder="Enter the entrance name" // Suggest user input
                required
            />
        </div>
    )
}