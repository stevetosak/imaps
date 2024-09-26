import React, { useState, useEffect } from "react";
import styles from "./RoomTypeModal.module.css";

export default function RoomTypeModal(args) {
  const [modal, setModal] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
  });

  const toggleModal = () => {
    setModal(!modal);
  };

  // Add new room type to the list
  const addRoomType = () => {
    if (!formData.type || roomTypes.includes(formData.type)) return; // Prevent empty or duplicate room types
    setRoomTypes((prevTypes) => [...prevTypes, formData.type]);
    setFormData({ ...formData, type: "" }); // Reset type input after adding
    args.map.addRoomType(formData.type);
    console.log(args.map.roomTypes);
  };

  // Remove room type from the list
  const removeRoomType = (typeToRemove) => {
    setRoomTypes((prevTypes) => prevTypes.filter((type) => type !== typeToRemove));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Load room types from local storage on mount
  // useEffect(() => {
  //   //const storedRoomTypes = JSON.parse(localStorage.getItem("roomTypes")) || [];
  //   if(args && args.map){
  //     setRoomTypes(args.map.roomTypes);
  //   }
  
  // }, [args]);

  // Save room types to local storage whenever they change
  // useEffect(() => {
  //   localStorage.setItem("roomTypes", JSON.stringify(roomTypes));
  // }, [roomTypes]);

  return (
    <>
      <button onClick={toggleModal} className={styles.btnModal}>
        Room Type Modal
      </button>

      {modal && (
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
