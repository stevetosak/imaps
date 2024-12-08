import React, { useRef, useState, useEffect } from "react";
import styles from "../EntranceModal/EntranceModal.module.css";

export default function Modal({ children, title, isOpen, toggleModal }) {
  const modalRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: "50%", y: "50%" });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (!modalRef.current) return;
    setDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  if (isOpen) {
    document.body.classList.add(styles.activeModal);
  } else {
    document.body.classList.remove(styles.activeModal);
  }

  return (
      <>
        {isOpen && (
            <div className={styles.modal}>
              <div onClick={toggleModal} className={styles.overlay}></div>
              <div
                  ref={modalRef}
                  className={styles.modalContent}
                  style={{
                    top: typeof position.y === "string" ? position.y : `${position.y}px`,
                    left: typeof position.x === "string" ? position.x : `${position.x}px`,
                    transform:
                        typeof position.x === "string" && typeof position.y === "string"
                            ? "translate(-50%, -50%)"
                            : "none",
                  }}
              >
                <div
                    className={styles.draggableHeader}
                    onMouseDown={handleMouseDown}
                >
                  <h2>{title}</h2>
                </div>
                <form className={styles.form}>
                  {children}
                  <button className={styles.closeModal} onClick={toggleModal}>
                    CLOSE
                  </button>
                </form>
              </div>
            </div>
        )}
      </>
  );
}
