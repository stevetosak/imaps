import React from "react";
import styles from "./MapInfoModal.module.css";
import {replace, useNavigate} from "react-router-dom";

export default function MapInfoModal({ isOpen, onClose, map, onDelete }) {
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

    const isInvalid = map.status === "INVALID";

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <img src={map.image_url} alt="Map Thumbnail" className={styles.mapImage}/>
                <h2 className={styles.title}>{map.mapName}</h2>
                <p><strong>Status:</strong> {isInvalid ? "Pending Approval" : map.status}</p>

                {!isInvalid && (
                    <>
                        <p><strong>Created At:</strong> {new Date(map.created_at).toLocaleString()}</p>
                        <p><strong>Modified At:</strong> {new Date(map.modified_at).toLocaleString()}</p>
                        <p><strong>Published
                            At:</strong> {map.published_at ? new Date(map.published_at).toLocaleString() : "Not published yet"}
                        </p>
                        <p>
                            <strong>Google Maps URL:</strong>{" "}
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
            </div>
        </div>
    );
}
