import React, { useState } from "react";
import styles from "./MapInfoModal.module.css";
import {replace, useNavigate} from "react-router-dom";
import edit_icon from "../../assets/edit_icon_black.png";

export default function MapInfoModal({ isOpen, onClose, map, onDelete, onUpdate }) {
    const [isEditPopupOpen, setEditPopupOpen] = useState(false);
    const [editedName, setEditedName] = useState(map?.mapName || "");
    const [editedGmapsUrl, setEditedGmapsUrl] = useState(map?.gmaps_url || "");
    const [editedStatus, setEditedStatus] = useState(map?.status || "PUBLIC");
    const navigate = useNavigate();

    if (!isOpen || !map) return null;

    const handleView = () => {
        navigate(`/myMaps/${map.mapName}/View`)
    };

    const handleEdit = () => {
        navigate(`/myMaps/${map.mapName}/Draw`)
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete the map "${map.mapName}"?`)) {
            onDelete(map.mapName);
            onClose();
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const updatedMap = {
                ...map,
                status: newStatus,
            };
            await onUpdate(updatedMap);
            setEditedStatus(newStatus);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const isInvalid = map.status === "INVALID";

    const openEditPopup = () => {
        setEditPopupOpen(true);
    };

    const closeEditPopup = () => {
        setEditPopupOpen(false);
    };

    const handleEditSubmit = async () => {
        const updatedMap = {
            ...map,
            mapName: editedName,
            gmaps_url: editedGmapsUrl,
        };

        try {
            await onUpdate(updatedMap);
            setEditPopupOpen(false);
        } catch (error) {
            console.error("Error updating map:", error);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <img src={map.image_url} alt="Map Thumbnail" className={styles.mapImage} />
                <h2 className={styles.title}>
                    {map.mapName}
                    <img
                        src={edit_icon}
                        alt="Edit"
                        className={styles.editIcon}
                        onClick={openEditPopup}
                    />
                </h2>
                <p><strong>Status:</strong> {isInvalid ? "Pending Approval" : (
                    <select
                        value={editedStatus}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className={styles.statusDropdown}
                    >
                        <option value="PUBLIC">Public</option>
                        <option value="PRIVATE">Private</option>
                    </select>
                )}</p>

                {!isInvalid && (
                    <>
                        <p><strong>Created At:</strong> {new Date(map.created_at).toLocaleString()}</p>
                        <p><strong>Modified At:</strong> {new Date(map.modified_at).toLocaleString()}</p>
                        <p><strong>Published At:</strong> {map.published_at ? new Date(map.published_at).toLocaleString() : "Not published yet"}</p>
                        <p>
                            <strong>Google Maps URL:</strong>
                            <a href={map.gmaps_url} target="_blank" rel="noopener noreferrer">
                                Open in Google Maps
                            </a>
                        </p>
                    </>
                )}

                <div className={styles.buttonContainer}>
                    <button className={styles.viewButton} onClick={handleView} disabled={isInvalid}>
                        View
                    </button>
                    <button className={styles.editButton} onClick={handleEdit} disabled={isInvalid}>
                        Edit
                    </button>
                    <button className={styles.deleteButton} onClick={handleDelete}>
                        Delete
                    </button>
                </div>
                <button className={styles.closeButton} onClick={onClose}>
                    Close
                </button>

                {isEditPopupOpen && (
                    <div className={styles.editPopupOverlay} onClick={closeEditPopup}>
                        <div
                            className={styles.editPopupContent}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className={styles.title}>Edit Map Details</h3>
                            <div className={styles.editField}>
                                <label>Map Name:</label>
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                />
                            </div>
                            <div className={styles.editField}>
                                <label>Google Maps URL:</label>
                                <input
                                    type="text"
                                    value={editedGmapsUrl}
                                    onChange={(e) => setEditedGmapsUrl(e.target.value)}
                                />
                            </div>
                            <div className={styles.editPopupButtons}>
                                <button className={styles.submitButton} onClick={handleEditSubmit}>
                                    Submit
                                </button>
                                <button className={styles.cancelButton} onClick={closeEditPopup}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}