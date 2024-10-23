import React, { useState } from "react";
import styles from "./CreateMapModal.module.css";

import PropTypes from "prop-types";
import HttpService from "../../../scripts/net/HttpService.js";
const MapDetailsModal = ({ isOpen, onClose, onSubmit }) => {
    const [mapName, setMapName] = useState("");
    const [mapType, setMapType] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const mapDetails = {
            name: mapName,
            type: mapType,
        };

        const httpService = new HttpService();
        httpService.setAuthenticated();

        httpService.put("/protected/maps/create",mapDetails)
            .then(resp => {
                console.log("RESPONSE CREATE: ",resp);
            })

        onSubmit(mapDetails);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Enter Map Details</h2>
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
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

MapDetailsModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func
};

export default MapDetailsModal;
