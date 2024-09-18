import React, { useState, useEffect } from "react";
import styles from "./RoomModal.module.css";
import { Ring } from "konva/lib/shapes/Ring";

export default function RoomModal() {
  const [modal, setModal] = useState(false);
  const [room, setRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
  });

  const toggleModal = () => {
    if(modal) room.info = formData;
    setModal(!modal);
  };

  const saveDetails = () => {
    if (room) {
      room.info = formData;
      toggleModal();
      console.log(room.info);
    }
  }
  // impl da sa gledat dali ti e zacuvana formava

  const handleInputChange = (e) => {
    
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    room.info = formData;
  };

  useEffect(() => {
    const openModalHandler = (event) => {
      const roomObj = event.detail;
      setRoom(roomObj);
      setFormData({
        name: roomObj.info.name,
        type: roomObj.info.type,
        description: roomObj.info.description,
      });
      toggleModal(true);
    };

    window.addEventListener("openRoomModalEvent", openModalHandler);

    return () => {
      window.removeEventListener("openRoomModalEvent", openModalHandler);
    };
  }, []);

  if (modal) {
    document.body.classList.add(styles.activeModal);
  } else {
    document.body.classList.remove(styles.activeModal);
  }

  return (
    <>
      <button onClick={toggleModal} className={styles.btnModal}>
        RoomModal
      </button>

      {modal && (
        <div className={styles.modal}>
          <div onClick={toggleModal} className={styles.overlay}></div>
          <div className={styles.modalContent}>
            <h2>Enter Room Details</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="type">Type:</label>
                <select id="type" name="type" onChange={handleInputChange} value={formData.type} required>
                  <option value="">Select Type</option>
                  <option value="office">Office</option>
                  <option value="classroom">Classroom</option>
                  <option value="lab">Lab</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
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
            </form>
            <button className={styles.closeModal} onClick={toggleModal}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
