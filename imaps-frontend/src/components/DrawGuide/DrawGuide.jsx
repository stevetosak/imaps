import React, { useState } from "react";
import styles from "./DrawGuide.module.css";
import help_icon from "../../assets/help_icon.png";

export default function DrawGuide() {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <>
      <button onClick={toggleModal} className={styles.btnModal}></button>

      {modal && (
        <div className={styles.modal}>
          <div onClick={toggleModal} className={styles.overlay}></div>
          <div className={styles.modalContent}>
            <h2>How to Use the Map Builder</h2>
            <p>Welcome to the Map Builder! Follow these steps to create your map:</p>
            <ul>
              <li>First, insert the room types by selecting from the available options.</li>
              <li>
                Next, start drawing the layout by dragging and dropping walls and rooms. You can resize and
                adjust them accordingly to fit your desired layout.
              </li>
              <li>
                To add specific information about a room, double-click on the room or pin. This will open a
                dialog where you can enter room details such as the room name, type, and other important
                information.
              </li>
              <li>
                Finally, place infoPins on the map to assist with navigation. These pins will be used to guide
                users from one room to another within the building.
              </li>
            </ul>
            <p>After completing your map, save the details and your custom layout will be ready for use!</p>

            <button className={styles.closeModal} onClick={toggleModal}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
