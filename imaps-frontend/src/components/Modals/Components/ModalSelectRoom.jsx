import styles from "../EntranceModal/EntranceModal.module.css";
import React from "react";

export default function ModalSelectRoom({formData,updateModalData}){
    return (
        <div className={styles.formGroup}>
            <label htmlFor="connectedRoom">Select room associated with entrance:</label>
            <select
                id="connectedRoom"
                name="connectedRoom"
                value={formData.connectedRoom}
                onChange={updateModalData}
                required
            >
                <option value="">Select Room</option>
                {formData.availableRooms.map((room, index) => (
                    <option key={index} value={room.name}>
                        {room.name}
                    </option>
                ))}
            </select>
        </div>
    )
}