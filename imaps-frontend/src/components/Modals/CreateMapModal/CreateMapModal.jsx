import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import styles from "./CreateMapModal.module.css";
import HttpService from "../../../scripts/net/HttpService.js";
import { AuthContext } from "../../AuthContext/AuthContext.jsx";

const MapDetailsModal = ({ isOpen, onClose, onSubmit }) => {
    const [mapName, setMapName] = useState("");
    const [mapType, setMapType] = useState("");
    const { username } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        const mapDetails = {
            name: mapName,
            type: mapType,
        };

        const httpService = new HttpService();
        httpService.setAuthenticated();

        httpService
            .put(`/protected/my-maps/create?username=${username}`, mapDetails)
            .then((resp) => {
                console.log("RESPONSE CREATE: ", resp);
            });

        onSubmit(mapDetails);
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

MapDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default MapDetailsModal;
