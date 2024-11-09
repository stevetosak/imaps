import styles from "../EntranceModal/EntranceModal.module.css";
import React from "react";
export default function Modal({children, title ,isOpen,toggleModal}) {

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
                    <div className={styles.modalContent}>
                        <h2>{title}</h2>
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


    )
}