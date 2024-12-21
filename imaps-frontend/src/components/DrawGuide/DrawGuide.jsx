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
            <h2 className={styles.title}>How to Use the Map Builder</h2>
            <p className={styles.paragraph}>Welcome to the Map Builder! Here you can create an indoor map, render it and enjoy!:</p>
            <br></br>
            <ul>
              <h3>Shapes and Placement</h3>
              <li>There are 4 types of shapes : Walls, Rooms, Entrances and Pins. </li>
              <li>By clicking on a shape's respective icon, that shape will follow your mouse untill you place it by clicking anywhere on the canvas</li>
              <li>Placed shapes automatically get snapped in place, with respect to the grid</li>
              <li>You can place a pin on the canvas by right clicking and then left clicking - imat bug tuka nekogas direktno se postavuvaat</li>
              <br></br>
              <h3>Adding information</h3>
              <li>By double clicking on any shape (except a Wall), you can add information to the shape</li>
              <li>Every shape holds basic information like a name, and more advanced information for navigation aswell</li>
              <br></br>
              <li>To explore map building in detail you can check our own wiki page. TODO</li>
            </ul>
            <br></br>
            <p className={styles.paragraph}>After completing your map, click the render button and go to the View page to see your full featured map!</p>

            <button className={styles.closeModal} onClick={toggleModal}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
