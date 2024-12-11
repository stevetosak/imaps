import React, {useEffect, useState} from "react";
import styles from "./AdminPage.module.css";
import {TilesContainer} from "react-tiles-dnd";
import HttpService from "../../scripts/net/HttpService.js";
import config from "../../scripts/net/netconfig.js";
import card from "../../assets/card-map.png";
import MapInfoModal from "../../components/MapInfoModal/MapInfoModal.jsx";
import {useAppContext} from "../../components/AppContext/AppContext.jsx";
import PublishForm from "../../components/PublishForm/PublishForm.jsx";
import httpService from "../../scripts/net/HttpService.js";

const renderTile = ({data, isDragging}, handleApprove, handleDeny, openMapInfoModal, openPublishForm) => (
    <div className={`${styles.tile} ${isDragging ? styles.dragging : ""}`} onClick={() => openMapInfoModal(data)}>
        <img src={card} className={styles.imgStyle} alt="Map Thumbnail"/>
        <div className={styles.mapTitle}>{data.mapName}</div>
        <button className={styles.viewPublishFormButton} onClick={(e) => {
            e.stopPropagation();
            openPublishForm(data);
        }}>
            View Form
        </button>
        <div className={styles.buttonContainer}>
            <input
                type="text"
                placeholder="Reason"
                className={styles.reasonInput}
                onClick={(e) => e.stopPropagation()}
            />
            {/*<div className={styles.buttonsGroup}>*/}
            {/*    <button className={styles.approveButton} onClick={(e) => {*/}
            {/*        e.stopPropagation();*/}
            {/*        handleApprove(data.mapName);*/}
            {/*    }}>*/}
            {/*        Approve*/}
            {/*    </button>*/}
            {/*    <button className={styles.denyButton} onClick={(e) => {*/}
            {/*        e.stopPropagation();*/}
            {/*        const reason = e.target.closest('div').previousSibling.value;*/}
            {/*        handleDeny(data.mapName, reason);*/}
            {/*    }}>*/}
            {/*        Deny*/}
            {/*    </button>*/}

            {/*</div>*/}
        </div>
    </div>
);

const tileSize = (tile) => ({
    colSpan: tile.cols,
    rowSpan: tile.rows,
});

export default function AdminPage() {
    const [pendingMaps, setPendingMaps] = useState([]);
    const [selectedMap, setSelectedMap] = useState(null);
    const [isMapInfoModalOpen, setIsMapInfoModalOpen] = useState(false);
    const [publishFormMap, setPublishFormMap] = useState(null);
    const [publishRequests,setPublishRequests] = useState([]);
    const [currentForm,setCurrentForm] = useState({});
    const {username} = useAppContext();

    useEffect(() => {
        const loadPendingMaps = async () => {
            const httpService = new HttpService();
            httpService.setAuthenticated();

            const respMaps = await httpService.get(`${config.admin.display}`);

            const mapTiles = respMaps.map((elem) => ({
                mapName: elem.mapName,
                cols: 1,
                rows: 1,
                status: elem.mapStatus,
                created_at: elem.createdAt,
                modified_at: elem.modifiedAt,
                gmaps_url: elem.gmaps_url,
                image_url: card,
            })).filter((tile) => tile.status === "INVALID");

            setPendingMaps(mapTiles);
        };

        loadPendingMaps();
    }, [username]);

    useEffect(() => {
        const loadPublishRequests = async () => {
            const httpService = new HttpService(true);
            const respPr = await httpService.get(`${config.admin.load_pr}`)

            setPublishRequests(respPr);
        }

        loadPublishRequests();
    }, []);

    const handleApprove = async (id) => {
        const httpService = new HttpService();
        httpService.setAuthenticated();
        const url = `${config.admin.approve_pr}?id=${id}`;

        try {
            await httpService.post(url);
            setPendingMaps((prev) => prev.filter((map) => map.mapName !== id));
            alert(`Publish Request "${id}" approved.`);
        } catch (error) {
            console.error("Error approving pr:", error);
            alert("Failed to approve pr.");
        }
    };

    const handleDeny = async (id, reason) => {
        const httpService = new HttpService();
        httpService.setAuthenticated();
        const url = `${config.admin.deny_pr}?id=${id}&reason=${encodeURIComponent(reason)}`;

        try {
            await httpService.post(url);
            //setPendingMaps((prev) => prev.filter((map) => map.mapName !== id));
            alert(`Publish request "${id}" denied.`);
        } catch (error) {
            console.error("Error denying pr:", error);
            alert("Failed to deny pr.");
        }
    };

    const handlePublishFormSubmit = async (formData) => {
        const httpService = new HttpService();
        httpService.setAuthenticated();
        const url = `${config.admin.approve_pr}?mapName=${formData.mapName}`;

        try {
            await httpService.post(url, formData); // Assuming formData contains all required fields
            setPendingMaps((prev) => prev.filter((map) => map.mapName !== formData.mapName));
            alert(`Map "${formData.mapName}" published successfully.`);
            closePublishForm();
        } catch (error) {
            console.error("Error publishing map:", error);
            alert("Failed to publish map. Please try again.");
        }
    };


    const openMapInfoModal = (map) => {
        setSelectedMap(map);
        setIsMapInfoModalOpen(true);
    };

    const closeMapInfoModal = () => {
        setIsMapInfoModalOpen(false);
        setSelectedMap(null);
    };

    const openPublishForm = (data) => {
        console.log("DATA MAP NAME",data.mapName)
        publishRequests.forEach(pr => {
            console.log("PR: " + JSON.stringify(pr))
        })

        const pr = publishRequests.find(p => p.mapName === data.mapName);
        console.log("FOUND PR: " + pr)
        setCurrentForm(pr)
        setPublishFormMap(data);
    };

    const closePublishForm = () => {
        setPublishFormMap(null);
    };

    return (
        <div className={styles.container}>
            <h1>Pending Maps for Approval</h1>

            {publishFormMap && (
                <PublishForm
                    isAdmin={true}
                    formData={currentForm}
                    onSubmit={handlePublishFormSubmit}
                    onCancel={closePublishForm}
                    onApprove={handleApprove}
                    onDeny={handleDeny}
                />
            )}


            <div className={styles.mapsContainer}>
                <TilesContainer
                    data={pendingMaps}
                    renderTile={(tileProps) => renderTile(tileProps, handleApprove, handleDeny, openMapInfoModal, openPublishForm)}
                    tileSize={tileSize}
                    forceTileWidth={200}
                    forceTileHeight={350}
                />
            </div>
            {isMapInfoModalOpen && (
                <MapInfoModal
                    isOpen={isMapInfoModalOpen}
                    onClose={closeMapInfoModal}
                    map={selectedMap}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                />
            )}

        </div>
    );
}

export const AdminPage = () => {
    useEffect(() => {
        const httpService = new HttpService(true);
        httpService.get("http://localhost:8080/api/auth/test_auth").then(r => console.log("RESP TEST: " + JSON.stringify(r))).catch(reason => console.log("ERR",reason))
    }, []);
}