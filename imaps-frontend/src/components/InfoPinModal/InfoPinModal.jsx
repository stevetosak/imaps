import React, { useState, useEffect } from "react";
import styles from "./InfoPinModal.module.css"; // Reusing the same styles

export default function InfoPinModal(props) {
  const [modal, setModal] = useState(false);
  const [pins, setPins] = useState([]);
  const [room, setRoom] = useState(null);

  const [formData, setFormData] = useState({
    name: "", 
    description: "",
    selectedPin: "",
    availablePins: [],
  });

  const toggleModal = () => {
    if (modal) {
      room.info = { ...formData, pins };
    }
    setModal(!modal); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addPinToList = () => {
    if (!formData.selectedPin || pins.includes(formData.selectedPin)) return; 
    setPins((prevPins) => [...prevPins, formData.selectedPin]);
    
    // Remove selected pin from available pins
    setFormData((prevData) => ({
      ...prevData,
      availablePins: prevData.availablePins.filter(pin => pin.name !== formData.selectedPin),
      selectedPin: "", // Clear selected pin
    }));
  };

  const removePinFromList = (pinToRemove) => {
    setPins((prevPins) => prevPins.filter((pin) => pin !== pinToRemove));

    // Re-add the removed pin to available pins
    setFormData((prevData) => ({
      ...prevData,
      availablePins: [...prevData.availablePins, { name: pinToRemove }],
    }));
  };

  const saveDetails = () => {
    console.log({ ...formData, pins });
    toggleModal();
  };

  useEffect(() => {
    const openModalHandler = (event) => {
      const roomObj = event.detail.room;
      setRoom(roomObj);
      setFormData({
        name: roomObj.info.name || "", 
        description: roomObj.info.description || "",
        selectedPin: "",
        availablePins: event.detail.map.getPins(), // Initialize available pins
      });
      setPins(roomObj.info.pins || []); 
      setModal(true);
    };

    window.addEventListener("openPinModalEvent", openModalHandler);

    return () => {
      window.removeEventListener("openPinModalEvent", openModalHandler);
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
        Info Pin Modal
      </button>

      {modal && (
        <div className={styles.modal}>
          <div onClick={toggleModal} className={styles.overlay}></div>
          <div className={styles.modalContent}>
            <h2>Enter Pin Details</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter the pin name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="selectedPin">Select pins connected to this pin:</label>
                <select
                  id="selectedPin"
                  name="selectedPin"
                  value={formData.selectedPin}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Pin</option>
                  {formData.availablePins.map((pin, index) => (
                    <option key={index} value={pin.name}>
                      {pin.name}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={addPinToList} className={styles.addButton}>
                  Add Pin
                </button>
              </div>

              <h3>Pins:</h3>
              <ul className={styles.pinList}>
                {pins.length > 0 ? (
                  pins.map((pin, index) => (
                    <li key={index} className={styles.pinItem}>
                      {pin}
                      <button onClick={() => removePinFromList(pin)} className={styles.removeButton}>
                        Remove
                      </button>
                    </li>
                  ))
                ) : (
                  <li>No pins added</li>
                )}
              </ul>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter description for the pin"
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
