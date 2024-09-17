import React, { useState, useEffect } from "react";
import styles from "./EntranceModal.module.css";

export default function EntranceModal() {
  const [modal, setModal] = useState(false);
  const [room, setRoom] = useState(null);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    description: "",
    isMainEntrance: false,
  });

  const toggleModal = () => {
    if(modal) room.info = formData;
    setModal(!modal);
  };

  const saveDetails = () => {
    if (room) {
      room.info = formData;
      toggleModal();
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    const openModalHandler = (event) => {
      const roomObj = event.detail;
      setRoom(roomObj);
      setFormData({
        from: roomObj.info.from,
        to: roomObj.info.to,
        description: roomObj.info.description,
        isMainEntrance: roomObj.info.isMainEntrance || false,
      });
      toggleModal(true);
      console.log(formData);
    };

    window.addEventListener("openEntranceModalEvent", openModalHandler);

    return () => {
      window.removeEventListener("openEntranceModalEvent", openModalHandler);
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
        Entrance Modal
      </button>

      {modal && (
        <div className={styles.modal}>
          <div onClick={toggleModal} className={styles.overlay}></div>
          <div className={styles.modalContent}>
            <h2>Enter Entrance Details</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="from">From:</label>
                <input
                  type="text"
                  id="from"
                  name="from"
                  value={formData.from}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="to">To:</label>
                <select id="to" name="to" onChange={handleInputChange} value={formData.to} required>
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