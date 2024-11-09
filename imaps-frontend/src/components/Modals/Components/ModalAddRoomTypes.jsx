import styles from "../RoomTypeModal/RoomTypeModal.module.css";
import React from "react";

export default function ModalAddRoomTypes(handleInputChange,formData,addRoomType){
    return (
        <>
            <h2>Manage Room Types</h2>
            <div className={styles.formGroup}>
                <label htmlFor="type">Add New Room Type:</label>
                <input
                    type="text"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    placeholder="Enter a new room type (e.g., Office, Classroom)"
                />
                <button type="button" className={styles.addButton} onClick={addRoomType}>
                    Add Type
                </button>
            </div>
        </>

    )
}