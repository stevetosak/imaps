import styles from "../EntranceModal/EntranceModal.module.css";
import React from "react";

export default function ModalSelectRoom({shapeInfo,availableRooms,updateModalData}){
    return (
        <div className={styles.formGroup}>
            <label htmlFor="connectedRoom">Select room associated with entrance:</label>
            <select
                id="connectedRoom"
                name="connectedRoom"
                value={shapeInfo.connectedRoom}
                onChange={updateModalData}
                required
            >
                <option value="">Select Room</option>
                {availableRooms.map((room, index) => (
                    <option key={index} value={room.info.name}>
                        {room.info.name}
                    </option>
                ))}
            </select>
        </div>
    )
}