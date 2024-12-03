import styles from "../EntranceModal/EntranceModal.module.css";
import React from "react";

export default function ModalSelectConnections({shape = null,availableShapes,updateModalData,addPinToList,}) {

    return shape && (
        <div className={styles.formGroup}>
                <label htmlFor="selectedPin">Select connections:</label>
                <select
                    id="selectedPin"
                    name="selectedPin"
                    value={shape.info.selectedPin}
                    onChange={updateModalData}
                    required
                >
                    <option value="">Select Connection</option>
                    {availableShapes.filter ((conn) =>
                                shape.info.selectedPins.includes(conn.name) === false &&
                                conn.name !== "" &&
                                conn.name !== shape.info.name
                        )
                        .map((conn, index) => (
                            <option key={index} value={conn.info.name}>
                                {conn.info.name}
                            </option>
                        ))}
                </select>
                <button type="button" onClick={addPinToList} className={styles.addButton}>
                    Add Connection
                </button>
            </div>
    )
}