import React, { useState, useEffect } from "react";
import styles from "./InfoPinModal.module.css"; // Reusing the same styles

export default function InfoPinModal() {
  const [modal, setModal] = useState(false);
  const [pins, setPins] = useState([]);
  const [availablePins, setAvailablePins] = useState(["Pin A", "Pin B", "Pin C", "Pin D"]); // Example predefined pins

  const [formData, setFormData] = useState({
    pinName: "", // Add name field
    description: "",
    selectedPin: "",
  });

  const toggleModal = () => {
    setModal(!modal); // Toggle modal state
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addPinToList = () => {
    if (!formData.selectedPin || pins.includes(formData.selectedPin)) return; // Prevent duplicates
    setPins((prevPins) => [...prevPins, formData.selectedPin]);
    setFormData({ ...formData, selectedPin: "" }); // Clear pin input
  };

  const removePinFromList = (pinToRemove) => {
    setPins((prevPins) => prevPins.filter((pin) => pin !== pinToRemove));
  };

  const saveDetails = () => {
    console.log({ ...formData, pins }); // Save selected pin and description, plus added pins
    toggleModal();
  };

  useEffect(() => {
    const openModalHandler = () => {
      setFormData({
        pinName: "", // Reset on open
        description: "",
        selectedPin: "",
      });
      setPins([]); // Reset pins
      toggleModal(true);
    };

    window.addEventListener("openInfoPinModalEvent", openModalHandler);

    return () => {
      window.removeEventListener("openInfoPinModalEvent", openModalHandler);
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
              {/* Pin Name */}
              <div className={styles.formGroup}>
                <label htmlFor="pinName">Name:</label>
                <input
                  type="text"
                  id="pinName"
                  name="pinName"
                  value={formData.pinName}
                  onChange={handleInputChange}
                  placeholder="Enter the pin name"
                  required
                />
              </div>

              {/* Pins Dropdown for Hallway Navigation */}
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
                  {availablePins.map((pin, index) => (
                    <option key={index} value={pin}>
                      {pin}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={addPinToList} className={styles.addButton}>
                  Add Pin
                </button>
              </div>

              {/* Display added pins */}
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

              {/* Description */}
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

              {/* Save Button */}
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
