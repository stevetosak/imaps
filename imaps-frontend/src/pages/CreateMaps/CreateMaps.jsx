import React, {useContext, useEffect, useState} from "react";
import styles from "./CreateMaps.module.css";
import {TilesContainer} from "react-tiles-dnd";
import MapInfoModal from "../../components/MapInfoModal/MapInfoModal.jsx";
import MapDetailsModal from "../../components/Modals/CreateMapModal/CreateMapModal.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import {AuthContext} from "../../components/AuthContext/AuthContext.jsx";
import card from "../../assets/card-map.png";
import Logo from "../../components/Logo/Logo.jsx";
import Profile from "../../components/Profile/Profile.jsx";

const renderTile = ({data, isDragging}, openMapInfo) => (
    <div style={{padding: "1rem", width: "100%"}}>
        <div
            className={`${styles.tile} ${isDragging ? styles.dragging : ""}`}
            style={{width: "100%", height: "100%"}}
            onClick={() => openMapInfo(data)}
        >
            <img src={card} className={styles.imgStyle} alt="Map Thumbnail"/>
            <div className={styles.mapTitle}>{data.mapName}</div>
        </div>
    </div>
);

const tileSize = (tile) => ({
    colSpan: tile.cols,
    rowSpan: tile.rows,
});

export default function CreateMaps() {
    const [tiles, setTiles] = useState([]);
    const [allTiles, setAllTiles] = useState([]);
    const {username} = useContext(AuthContext);
    const [selectedMap, setSelectedMap] = useState(null);
    const [isMapInfoModalOpen, setIsMapInfoModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const openMapInfoModal = (map) => {
        setSelectedMap(map);
        setIsMapInfoModalOpen(true);
    };

    const closeMapInfoModal = () => {
        setIsMapInfoModalOpen(false);
        setSelectedMap(null);
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleUpdate = async (updatedMap) => {
        // try {
        //     await fetch(`/api/maps/${updatedMap.id}`, {
        //         method: "PUT",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify(updatedMap),
        //     });
        //     console.log("Map updated successfully:", updatedMap);
        // } catch (error) {
        //     console.error("Error updating map:", error);
        // }
    };


    const deleteMap = (mapName) => {
        const httpService = new HttpService();
        httpService.setAuthenticated();
        const url = `/protected/my-maps/delete?mapName=${mapName}&username=${username}`;

        httpService
            .delete(url)
            .then((response) => {
                setTiles((prevTiles) => prevTiles.filter((tile) => tile.mapName !== mapName));
                setAllTiles((prevTiles) => prevTiles.filter((tile) => tile.mapName !== mapName));
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || error.message || "Unknown error";
                alert(`Error deleting the map: ${errorMessage}`);
            });
    };

    useEffect(() => {
        const loadPublicMaps = async () => {
            const httpService = new HttpService();
            httpService.setAuthenticated();
            const resp = await httpService.get(`/protected/my-maps/display?username=${username}`);

            const mapTiles = resp.map((elem) => ({
                mapName: elem.name,
                cols: 1,
                rows: 1,
                status: elem.status,
                created_at: elem.created_at,
                modified_at: elem.modified_at,
                published_at: elem.published_at,
                gmaps_url: elem.gmaps_url,
                image_url: card,
            }));

            setTiles(mapTiles);
            setAllTiles(mapTiles);
        };
        loadPublicMaps();
    }, [username]);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setTiles(allTiles.filter((tile) => tile.mapName.toLowerCase().includes(query)));
    };

    const publicMaps = tiles.filter((tile) => tile.status === "PUBLIC");
    const privateMaps = tiles.filter((tile) => tile.status === "PRIVATE");
    const pendingMaps = tiles.filter((tile) => tile.status === "INVALID");

    return (
        <div className={styles.container}>
            <Logo/>
            <Profile/>
            <h1>Your Maps</h1>

            <div className={styles.actionButtons}>
                <button className={styles.createMapsButton} onClick={openCreateModal}>
                    Create Map
                </button>
            </div>

            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search for maps..."
                    onChange={handleSearch}
                />
            </div>

            <div className={styles.mapsContainer}>
                <div className={styles.mapColumn}>
                    <h3 className={styles.categories}>Public Maps:</h3>
                    <hr/>
                    <TilesContainer
                        data={publicMaps}
                        renderTile={(tileProps) => renderTile(tileProps, openMapInfoModal)}
                        tileSize={tileSize}
                        forceTileWidth={150}
                        forceTileHeight={170}
                    />
                </div>

                <div className={styles.mapColumn}>
                    <h3 className={styles.categories}>Private Maps:</h3>
                    <hr/>
                    <TilesContainer
                        data={privateMaps}
                        renderTile={(tileProps) => renderTile(tileProps, openMapInfoModal)}
                        tileSize={tileSize}
                        forceTileWidth={150}
                        forceTileHeight={170}
                    />
                </div>

                <div className={styles.mapColumn}>
                    <h3 className={styles.categories}>Pending Approval:</h3>
                    <hr/>
                    <TilesContainer
                        data={pendingMaps}
                        renderTile={(tileProps) => renderTile(tileProps, openMapInfoModal)}
                        tileSize={tileSize}
                        forceTileWidth={150}
                        forceTileHeight={170}
                    />
                </div>
            </div>

            <MapInfoModal
                isOpen={isMapInfoModalOpen}
                onClose={closeMapInfoModal}
                map={selectedMap}
                onDelete={deleteMap}
                onUpdate={handleUpdate}
            />

            <MapDetailsModal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                onSubmit={(newMap) => {
                    setTiles((prevTiles) => [...prevTiles, newMap]);
                    setAllTiles((prevTiles) => [...prevTiles, newMap]);
                }}
            />
        </div>
    );
}
