import React, { useState, useEffect } from "react";
import styles from "./EntranceModal.module.css";

export default function EntranceModal() {
  const [modal, setModal] = useState(false);
  const [room, setRoom] = useState(null);
  const [pins, setPins] = useState([]);


  const [formData, setFormData] = useState({
    entranceName: "",
    connectedRoom: "",
    description: "",
    availableRooms: [],
    availablePins: [],
    selectedPins: [],
    isMainEntrance: false,
    selectedPin: "",
  });

  const toggleModal = () => {
    if (modal) {
      //const {entranceName, connectedRoom,description,isMainEntrance} = formData
      room.info = formData
      console.log(room.info);
    }
    setModal(!modal); 
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));


    console.log(formData);

  
  };

  const addPinToList = () => {
    if (!formData.selectedPin || pins.includes(formData.selectedPin)) return;
  
    // Update pins and formData with the new pin
    setPins((prevPins) => {
      const updatedPins = [...prevPins, formData.selectedPin];
      
      // Set the selectedPins in formData after updating pins
      setFormData((prevFormData) => ({
        ...prevFormData,
        selectedPin: "",
        selectedPins: updatedPins, // Reflect the updated pins
      }));
  
      return updatedPins; // Return the updated pins for state
    });
  
    console.log(formData.selectedPins, "sele");
  };
  

  const removePinFromList = (pinToRemove) => {
    setPins((prevPins) => prevPins.filter((pin) => pin !== pinToRemove));
    setFormData({ ...formData, selectedPins: pins});
  };

  const saveDetails = () => {
    if (room) {
      room.info = formData;
      toggleModal();
    }
  };

  useEffect(() => {
    const openModalHandler = (event) => {
      const roomObj = event.detail.room;
      setRoom(roomObj);
      
      // Populate pins and formData when the modal is opened
      const savedPins = roomObj.info.selectedPins || [];
      
      setFormData({
        entranceName: roomObj.info.entranceName || "",
        connectedRoom: roomObj.info.connectedRoom || "",
        description: roomObj.info.description || "",
        availablePins: event.detail.map.getPins() || [],
        availableRooms: event.detail.map.getRooms() || [],
        isMainEntrance: roomObj.info.isMainEntrance || false,
        selectedPin: "",
        selectedPins: savedPins, // Load saved pins into formData
      });
      
      setPins(savedPins); // Set the pins state with the saved pins
      setModal(true);
    
      console.log(savedPins, "Loaded pins on modal open");
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
              {/* Entrance Name */}
              <div className={styles.formGroup}>
                <label htmlFor="entranceName">Name:</label>
                <input
                  type="text"
                  id="entranceName"
                  name="entranceName"
                  value={formData.entranceName}
                  onChange={handleInputChange}
                  placeholder="Enter the entrance name" // Suggest user input
                  required
                />
              </div>

              {/* Select Room for Entrance */}
              <div className={styles.formGroup}>
                <label htmlFor="connectedRoom">Select room associated with entrance:</label>
                <select
                  id="connectedRoom"
                  name="connectedRoom"
                  value={formData.connectedRoom}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Room</option>
                  {formData.availableRooms.map((room, index) => (
                    <option key={index} value={room.name}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pins Dropdown for Hallway Navigation */}
              <div className={styles.formGroup}>
                <label htmlFor="selectedPin">Select pins connected to entrance:</label>
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
                />
              </div>

              {/* Main Entrance Checkbox */}
              <div className={styles.formGroupCheckbox}>
                <input
                  type="checkbox"
                  id="isMainEntrance"
                  name="isMainEntrance"
                  checked={formData.isMainEntrance}
                  onChange={handleInputChange}
                />
                <label htmlFor="isMainEntrance">Is Main Entrance?</label>
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
