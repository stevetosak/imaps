import styles from "../EntranceModal/EntranceModal.module.css";
import React from "react";

export default function ModalSelectConnections({formData,updateModalData,addPinToList}) {

    return (
        <>
            <div className={styles.formGroup}>
                <label htmlFor="selectedPin">Select connections:</label>
                <select
                    id="selectedPin"
                    name="selectedPin"
                    value={formData.selectedPin}
                    onChange={updateModalData}
                    required
                >
                    <option value="">Select Connection</option>
                    {formData.availablePins
                        .filter(
                            (pin) =>
                                formData.selectedPins.includes(pin.name) === false &&
                                pin.name !== "" &&
                                pin.name !== formData.name
                        )
                        .map((pin, index) => (
                            <option key={index} value={pin.name}>
                                {pin.name}
                            </option>
                        ))}
                </select>
                <button type="button" onClick={addPinToList} className={styles.addButton}>
                    Add Connection
                </button>
            </div>
        </>
    )
}