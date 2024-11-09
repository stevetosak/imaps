import styles from "../EntranceModal/EntranceModal.module.css";
import React from "react";

export default function ModalDescriptionField({formData,updateModalData}){
    return (
        <div className={styles.formGroup}>
            <label htmlFor="description">Description:</label>
            <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={updateModalData}
                rows="3"
            />
        </div>
    )
}