import styles from "../RoomModal/RoomModal.module.css";
import React from "react";

export default function ModalRoomTypes({formData,updateModalData,roomTypes}){
    return (
        <div className={styles.formGroup}>
            <label htmlFor="type">Type:</label>
            <select id="type" name="type" onChange={updateModalData} value={formData.type} required>
                <option value="">Select Room Type</option>
                {roomTypes.map((type, index) => (
                    <option key={index} value={type}>
                        {type}
                    </option>
                ))}
            </select>
        </div>
    )
}