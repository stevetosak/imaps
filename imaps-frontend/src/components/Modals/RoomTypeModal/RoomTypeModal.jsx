import React, { useState, useEffect } from "react";
import styles from "./RoomTypeModal.module.css";
import useRoomTypes from "../Hooks/useRoomTypes.jsx";

export default function RoomTypeModal({map,roomTypes,addRoomTypeDB}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [roomTypeName, setRoomTypeName] = useState("");

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleAddRoomType = async () => {
    await addRoomTypeDB(roomTypeName);
    setRoomTypeName("");
  }
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomTypeName(value);
  };

  return (
    <>
      <button onClick={toggleModal} className={styles.btnModal}>
        Room Types
      </button>

      {modalIsOpen && (
        <div className={styles.modal}>
          <div onClick={toggleModal} className={styles.overlay}></div>
          <div className={styles.modalContent}>
            <h2>Manage Room Types</h2>

            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="roomTypeName">Add New Room Type:</label>
                <input
                  type="text"
                  id="roomTypeName"
                  name="roomTypeName"
                  value={roomTypeName}
                  onChange={handleInputChange}
                  placeholder="Enter a new room type (e.g., Office, Classroom)"
                />
                <button type="button" className={styles.addButton} onClick={handleAddRoomType}>
                  Add Type
                </button>
              </div>
            </form>

            <h3>Available Room Types:</h3>
            <ul className={styles.roomTypeList}>
              {roomTypes.length > 0 ? (
                roomTypes.map((roomType,index) => (
                  <li key={index} className={styles.roomTypeItem}>
                    {roomType.name}
                    <button className={styles.removeButton} >
                      Remove
                    </button>
                  </li>
                ))
              ) : (
                <li>No room types available</li>
              )}
            </ul>

            <button className={styles.closeModal} onClick={toggleModal}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
