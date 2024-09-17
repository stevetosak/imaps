import React, { useState, useEffect } from "react";
import styles from "./EntranceModal.module.css";

export default function EntranceModal() {
  const [modal, setModal] = useState(false);
  const [room, setRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    floor: "",
    description: "",
    isMainEntrance: false, // Add the main entrance field
  });

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add(styles.activeModal);
  } else {
    document.body.classList.remove(styles.activeModal);
  }

  return (
    <>
      <button onClick={toggleModal} className={styles.btnModal}>
        EntranceModal
      </button>

      {modal && (
        <div className={styles.modal}>
          <div onClick={toggleModal} className={styles.overlay}></div>
          <div className={styles.modalContent}>
            <h2>Enter Entrance Details</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">From:</label>
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
                <label htmlFor="type">To:</label>
                <select id="type" name="type" onChange={handleInputChange} value={formData.type} required>
                  <option value="">Select Type</option>
                  <option value="office">Office</option>
                  <option value="classroom">Classroom</option>
                  <option value="lab">Lab</option>
                </select>
              </div>
              {/* <div className={styles.formGroup}>
                <label htmlFor="floor">Floor:</label>
                <input
                  type="number"
                  id="floor"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  required
                />
              </div> */}
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
                <label htmlFor="isMainEntrance">
                  <input
                    type="checkbox"
                    id="isMainEntrance"
                    name="isMainEntrance"
                    checked={formData.isMainEntrance}
                    onChange={handleInputChange}
                  />
                  Is Main Entrance?
                </label>
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
