import React, { useEffect, useState } from "react";
import styles from "./MapInfoModal.module.css";
import edit_icon from "../../assets/edit_icon_black.png";
import PublishForm from "../PublishForm/PublishForm.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import config from "../../scripts/net/netconfig.js";
import { useAppContext } from "../AppContext/AppContext.jsx";
import { useNavigate } from "react-router-dom";

export default function MapInfoModal({
                                         isOpen,
                                         onClose,
                                         map,
                                         onDelete,
                                         onUpdate,
                                         onPublish,
                                         published = false,
                                     }) {
    const [isEditPopupOpen, setEditPopupOpen] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedGmapsUrl, setEditedGmapsUrl] = useState("");
    const [editedType, setEditedType] = useState("");
    const [publishFormOpen, setPublishFormOpen] = useState(false);
    const navigate = useNavigate();
    const [loadedFormData, setLoadedFormData] = useState(null);
    const { setLoading } = useAppContext();
    const { loading } = useAppContext();
    const { username } = useAppContext();

    useEffect(() => {
        if (map) {
            setEditedName(map.mapName || "");
            setEditedGmapsUrl(map.gmaps_url || "");
            setEditedType(map.mapType || "");
        }
    }, [map, isEditPopupOpen]);

    if (!isOpen || !map) return null;

    const handleView = () => {
        navigate(`/myMaps/View/${map.mapName}`);
    };

    const handleEdit = () => {
        navigate(`/myMaps/Draw/${map.mapName}`);
    };

    const handleDelete = () => {
        if (
            window.confirm(`Are you sure you want to delete the map "${map.mapName}"?`)
        ) {
            onDelete(map.mapName);
            onClose();
        }
    };

    const openEditPopup = () => {
        setEditPopupOpen(true);
    };

    const closeEditPopup = () => {
        setEditPopupOpen(false);
    };

    const handleEditSubmit = async () => {
        const updatedMap = {
            initialName: map.mapName,
            name: editedName,
            gmapsUrl: editedGmapsUrl,
            type: editedType,
        };
        onUpdate(updatedMap);
        closeEditPopup()
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
            >
                {!loading && (
                    <>
                        <img
                            src={map.image_url}
                            alt="Map Thumbnail"
                            className={styles.mapImage}
                        />
                        <h2 className={styles.title}>
                            {map.mapName}
                            <img
                                src={edit_icon}
                                alt="Edit"
                                className={styles.editIcon}
                                onClick={openEditPopup}
                            />
                        </h2>
                        <p>
                            <strong>Status:</strong> {map.status}
                        </p>
                        <p>
                            <strong>Created At:</strong>{" "}
                            {new Date(map.created_at).toLocaleString()}
                        </p>
                        <p>
                            <strong>Modified At:</strong>{" "}
                            {new Date(map.modified_at).toLocaleString()}
                        </p>
                        <p>
                            <strong>Published At:</strong>{" "}
                            {map.published_at
                                ? new Date(map.published_at).toLocaleString()
                                : "Not published yet"}
                        </p>
                        <p>
                            <strong>Google Maps URL:</strong>{" "}
                            <a href={`${map.gmaps_url}`} rel="noopener noreferrer">
                                Open in Google Maps
                            </a>
                        </p>

                        <div className={styles.buttonContainer}>
                            <button className={styles.viewButton} onClick={handleView}>
                                View
                            </button>
                            <button className={styles.editButton} onClick={handleEdit}>
                                Edit
                            </button>
                            <button className={styles.deleteButton} onClick={handleDelete}>
                                Delete
                            </button>
                            {!map.is_published && !published && (
                                <button
                                    className={styles.publishButton}
                                    onClick={() => setPublishFormOpen(true)}
                                >
                                    Publish
                                </button>
                            )}
                        </div>
                        <button className={styles.closeButton} onClick={onClose}>
                            Close
                        </button>

                        {isEditPopupOpen && (
                            <div
                                className={styles.editPopupOverlay}
                                onClick={closeEditPopup}
                            >
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
                                    <div className={styles.editField}>
                                        <label>Map Type:</label>
                                        <input
                                            type="text"
                                            value={editedType}
                                            onChange={(e) => setEditedType(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.editPopupButtons}>
                                        <button
                                            className={styles.submitButton}
                                            onClick={handleEditSubmit}
                                        >
                                            Submit
                                        </button>
                                        <button
                                            className={styles.cancelButton}
                                            onClick={closeEditPopup}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
