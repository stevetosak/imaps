import React, { useState, useEffect } from "react";
import styles from "./RoomTypeModal.module.css";
import useRoomTypes from "../Hooks/useRoomTypes.jsx";

export default function RoomTypeModal({map}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
  });

  const toggleModal = () => {
    if(!modalIsOpen){
      console.log("RTPS TOG: " + map.roomTypes);
      setRoomTypes(map.roomTypes)
    }

    setModalIsOpen(!modalIsOpen);
  };

  const {addRoomType,removeRoomType} = useRoomTypes(formData,setFormData,roomTypes,setRoomTypes,map)


  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
            </form>

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

            <button className={styles.closeModal} onClick={toggleModal}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
