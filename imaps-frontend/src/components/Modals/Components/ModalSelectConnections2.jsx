import styles from "../EntranceModal/EntranceModal.module.css";
import React from "react";
import PropTypes from "prop-types";
import MapShape from "../../../scripts/base/MapShape.js";

export default function ModalSelectConnections2({shapeInfo,updateModalData,addConnection,availableShapes}) {

    console.log("shapes modal",availableShapes)
    return (
            <div className={styles.formGroup}>
                <label htmlFor="selectedPin">Select connections:</label>
                <select
                    id="selectedPin"
                    name="selectedPin"
                    value={shapeInfo.selectedPin}
                    onChange={updateModalData}
                >
                    <option value="">Select Connection</option>
                    {availableShapes
                        .filter(
                            (s) =>
                                !s.info.selectedPins.includes(shapeInfo.name) &&
                                s.info.name !== "" &&
                                s.info.name !== shapeInfo.name
                        )
                        .map((othShape, index) => (
                            <option key={index} value={othShape.info.name}>
                                {othShape.info.name}
                            </option>
                        ))}
                </select>
                <button type="button" onClick={addConnection} className={styles.addButton}>
                    Add Connection
                </button>
            </div>
    )
}

ModalSelectConnections2.propTypes = {
    shapeInfo: PropTypes.object,
    updateModalData: PropTypes.func,
    addConnection: PropTypes.func,
}