import React, { useState } from "react";
import styles from "./Modal.module.css";

export default function Modal() {
  const [modal, setModal] = useState(false);

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
        Open
      </button>

      {modal && (
        <div className={styles.modal}>
          <div onClick={toggleModal} className={styles.overlay}></div>
          <div className={styles.modalContent}>
            <h2>Enter Details</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="type">Type:</label>
                <select id="type" name="type" required>
                  <option value="">Select Type</option>
                  <option value="office">Office</option>
                  <option value="classroom">Classroom</option>
                  <option value="lab">Lab</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="floor">Floor:</label>
                <input type="number" id="floor" name="floor" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" rows="3" />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <input type="checkbox" name="mainEntrance" /> Is Main Entrance?
                </label>
              </div>
              <div className={styles.formGroup}>
                <button type="submit" className={styles.submitButton}>
                  Submit
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
