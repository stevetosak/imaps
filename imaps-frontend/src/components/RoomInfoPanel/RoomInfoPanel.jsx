import React, { useEffect, useRef } from "react";
import styles from "./RoomInfoPanel.module.css";

const RoomInfoPanel = ({ room, isOpen, onClose }) => {
  const panelRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener on component unmount or when isOpen changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={panelRef} className={`${styles.roomInfoPanel} ${isOpen ? styles.open : ""}`}>
      <button className={styles.closeButton} onClick={onClose}>
        ×
      </button>
      {room ? (
        <>
          <div className={styles.roomHeader}>
            <h2>{room.name}</h2>
            <h2>({room.type})</h2>
          </div>
          <div className={styles.roomImageWrapper}>
            <img src={room.image} alt={room.name} className={styles.roomImage} />
          </div>
          <div className={styles.roomDescription}>
            <p>{room.description}</p>
          </div>
        </>
      ) : (
        <p>Select a room to see details.</p>
      )}
    </div>
  );
};

export default RoomInfoPanel;
