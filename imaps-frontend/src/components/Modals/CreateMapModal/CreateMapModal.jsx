import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import styles from "./CreateMapModal.module.css";

const CreateMapModal = ({ isOpen, onClose,addMap}) => {
    const [mapName, setMapName] = useState("");
    const [mapType, setMapType] = useState("");

    const handleSubmit = (e) => {
        const mapDetails = {
            name: mapName,
            type: mapType,
        };

        addMap(mapDetails);

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>Enter Map Details</h2>
                <form onSubmit={handleSubmit} className={styles.formData}>
                    <label>
                        Map Name:
                        <input
                            type="text"
                            value={mapName}
                            onChange={(e) => setMapName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Map Type:
                        <input
                            type="text"
                            value={mapType}
                            onChange={(e) => setMapType(e.target.value)}
                            required
                        />
                    </label>
                    <div className={styles.modalButtons}>
                        <button type="submit" className={styles.modalSubmitButton}>
                            Submit
                        </button>
                        <button type="button" className={styles.modalCancelButton} onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

CreateMapModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CreateMapModal;
