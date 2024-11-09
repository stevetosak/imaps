import styles from "../RoomTypeModal/RoomTypeModal.module.css";
import React from "react";

export default function ModalDisplayRoomTypes(roomTypes,removeRoomType){
    return (
        <>
            <h3>Available Room Types:</h3>
            <ul className={styles.roomTypeList}>
                {roomTypes.length > 0 ? (
                    roomTypes.map((type, index) => (
                        <li key={index} className={styles.roomTypeItem}>
                            {type}
                            <button className={styles.removeButton} onClick={() => removeRoomType(type)}>
                                Remove
                            </button>
                        </li>
                    ))
                ) : (
                    <li>No room types available</li>
                )}
            </ul>
        </>
    )
}