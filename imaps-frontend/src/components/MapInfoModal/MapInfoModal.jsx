import React, {useEffect, useState} from "react";
import styles from "./MapInfoModal.module.css";
import {json, useNavigate} from "react-router-dom";
import edit_icon from "../../assets/edit_icon_black.png";
import PublishForm from "../PublishForm/PublishForm.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import config from "../../scripts/net/netconfig.js";
import {useAppContext} from "../AppContext/AppContext.jsx";

export default function MapInfoModal({isOpen, onClose, map, onDelete, onUpdate, onPublish, published=false}) {
    const [isEditPopupOpen, setEditPopupOpen] = useState(false);
    const [editedName, setEditedName] = useState(map?.mapName || "");
    const [editedGmapsUrl, setEditedGmapsUrl] = useState(map?.gmaps_url || "");
    const [publishFormOpen,setPublishFormOpen] = useState(false)
    const navigate = useNavigate();
    const[loadedFormData,setLoadedFormData] = useState(null)


    useEffect(() => {
        console.log("GMAPS: " + JSON.stringify(map))
    }, []);

    const {username} = useAppContext();

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
            //await onUpdate(updatedMap);
            setEditPopupOpen(false);
        } catch (error) {
            console.error("Error updating map:", error);
        }
    };

    const openPublishModal = async () => {
        const httpService = new HttpService(true);
        const respForm = await httpService.get(`${config.my_maps.publish_get}?mapName=${map.mapName}`)
        setLoadedFormData(respForm);
        setPublishFormOpen(true)
    };

    const sendPublishRequest = async (formData) => {
        const httpService = new HttpService(true);
        formData.mapName = map.mapName;
        console.log("FORMDATA: "+JSON.stringify(formData))
        await httpService.post(`${config.my_maps.publish}?username=${username}`,formData);
        setPublishFormOpen(false)
        onPublish()
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {publishFormOpen && (
                    <PublishForm mapName={map.mapName} formData={loadedFormData} onSubmit={sendPublishRequest} onCancel={() => setPublishFormOpen(false)}/>
                )}

                <img src={map.image_url} alt="Map Thumbnail" className={styles.mapImage}/>
                <h2 className={styles.title}>
                    {map.mapName}
                    <img
                        src={edit_icon}
                        alt="Edit"
                        className={styles.editIcon}
                        onClick={openEditPopup}
                    />
                </h2>
                <p><strong>Status:</strong> {map.status}</p>

                <p><strong>Created At:</strong> {new Date(map.created_at).toLocaleString()}</p>
                <p><strong>Modified At:</strong> {new Date(map.modified_at).toLocaleString()}</p>
                <p><strong>Published
                    At:</strong> {map.published_at ? new Date(map.published_at).toLocaleString() : "Not published yet"}
                </p>
                <p>
                    <strong>Google Maps URL:</strong>
                    <a href={map.gMapsUrl}  rel="noopener noreferrer">
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
                        <button className={styles.publishButton} onClick={openPublishModal}>
                            Publish
                        </button>
                    )}
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