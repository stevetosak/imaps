import styles from "../EntranceModal/EntranceModal.module.css";
import React from "react";

export default function ModalSaveButton({saveDetails}){
    return (
        <div className={styles.formGroup}>
            <button
                type="button"
                id="submit-details"
                onClick={saveDetails}
                className={styles.submitButton}
            >
                Save
            </button>
        </div>
    )
}