import styles from "../RoomModal/RoomModal.module.css";
import React from "react";

export default function ModalRoomTypes({shapeInfo,updateModalData,roomTypes}){
    console.log("ROOM TYPES: " + roomTypes)

    return (
        <div className={styles.formGroup}>
            <label htmlFor="type">Type:</label>
            <select id="type" name="type" onChange={updateModalData} value={shapeInfo.type} required>
                <option value="">Select Room Type</option>
                {roomTypes?.map((roomType, index) => (
                    <option key={index} value={roomType.name}>
                        {roomType.name}
                    </option>
                ))}
            </select>
        </div>
    )
}