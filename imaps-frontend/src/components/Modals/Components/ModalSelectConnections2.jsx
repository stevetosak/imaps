import styles from "../EntranceModal/EntranceModal.module.css";
import React from "react";

export default function ModalSelectConnections2({formData,updateModalData,addPinToList,shapes}) {

    console.log("shapes modal",shapes)
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
                    {shapes
                        .filter(
                            (shape) =>
                                formData.selectedPins.includes(shape.info.name) === false &&
                                shape.info.name !== "" &&
                                shape.info.name !== formData.name
                        )
                        .map((shape, index) => (
                            <option key={index} value={shape.info.name}>
                                {shape.info.name + ` [${shape.floorNum}F]`}
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