import React, { useEffect, useState } from "react";
import styles from "./CreateMaps.module.css";
import { TilesContainer } from "react-tiles-dnd";
import MapInfoModal from "../../components/MapInfoModal/MapInfoModal.jsx";
import CreateMapModal from "../../components/Modals/CreateMapModal/CreateMapModal.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import card from "../../assets/card-map.png";
import Logo from "../../components/Logo/Logo.jsx";
import Profile from "../../components/Profile/Profile.jsx";
import { useAppContext } from "../../components/AppContext/AppContext.jsx";
import config from "../../scripts/net/netconfig.js";
import Toast from "../../components/Toast/Toast.jsx";
import plus_icon from "../../assets/plus_icon.png";

const renderTile = ({ data, isDragging }, openMapInfo) => (
    <div style={{ padding: "1rem", width: "100%" }}>
        <div
            className={`${styles.tile} ${isDragging ? styles.dragging : ""}`}
            style={{ width: "100%", height: "100%" }}
            onClick={() => openMapInfo(data)}
        >
            <img src={card} className={styles.imgStyle} alt="Map Thumbnail" />
            <div className={styles.mapTitle}>{data.mapName}</div>
        </div>
    </div>
);

const tileSize = (tile) => ({
    colSpan: tile.cols,
    rowSpan: tile.rows,
});

export default function MyMaps() {
    const [tiles, setTiles] = useState([]);
    const [allTiles, setAllTiles] = useState([]);
    const { username } = useAppContext();
    const [selectedMap, setSelectedMap] = useState(null);
    const [isMapInfoModalOpen, setIsMapInfoModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [publicMaps, setPublicMaps] = useState([]);
    const [privateMaps, setPrivateMaps] = useState([]);
    const [pendingMaps, setPendingMaps] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState(1);

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

    const showToast = (message, type = 1) => {
        setToastMessage(message);
        setToastType(type);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleUpdate = async (updatedMap) => {
        // Placeholder for map update logic
    };

    const deleteMap = (mapName) => {
        const httpService = new HttpService();
        httpService.setAuthenticated();
        const url = `${config.my_maps.delete}?mapName=${mapName}&username=${username}`;

        httpService
            .delete(url)
            .then(() => {
                setTiles((prevTiles) => prevTiles.filter((tile) => tile.mapName !== mapName));
                setAllTiles((prevTiles) => prevTiles.filter((tile) => tile.mapName !== mapName));
                showToast("Map deleted", 1);
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || error.message || "Unknown error";
                showToast(`Error deleting the map: ${errorMessage}`, 0);
            });
    };

    const addMap = (mapDetails) => {
        const httpService = new HttpService();
        httpService.setAuthenticated();

        httpService
            .put(`${config.my_maps.add}?username=${username}`, mapDetails)
            .then((respMap) => {
                const mapTile = {
                    mapName: respMap.mapName,
                    cols: 1,
                    rows: 1,
                    status: respMap.mapStatus,
                    created_at: respMap.createdAt,
                    modified_at: respMap.modifiedAt,
                    published_at: respMap.published_at,
                    gmaps_url: respMap.gmapsUrl,
                    image_url: card,
                    is_published: respMap.is_published,
                };

                setAllTiles((prevTiles) => [...prevTiles, mapTile]);
                setTiles((prevTiles) => [...prevTiles, mapTile]);
                showToast("Map added successfully!");
            })
            .catch((error) => {
                showToast("Map name already taken", 0);
            });
    };

    useEffect(() => {
        const loadMaps = async () => {
            const httpService = new HttpService();
            httpService.setAuthenticated();

            const respMaps = await httpService.get(
                `${config.my_maps.display}?username=${username}`
            );

            const mapTiles = respMaps.map((elem) => ({
                mapName: elem.mapName,
                cols: 1,
                rows: 1,
                status: elem.mapStatus,
                created_at: elem.createdAt,
                modified_at: elem.modifiedAt,
                published_at: elem.published_at,
                gmaps_url: elem.gmapsUrl,
                image_url: card,
                numFavourites: elem.numFavourites,
            }));

            setTiles(mapTiles);
            setAllTiles(mapTiles);
        };
        loadMaps();
    }, [username]);

    useEffect(() => {
        setPublicMaps(tiles.filter((tile) => tile.status === "PUBLIC"));
        setPrivateMaps(tiles.filter((tile) => tile.status === "PRIVATE"));
        setPendingMaps(tiles.filter((tile) => tile.status === "PENDING"));
    }, [tiles]);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setTiles(allTiles.filter((tile) => tile.mapName.toLowerCase().includes(query)));
    };

    return (
        <div className={styles.container}>
            <Logo />
            <Profile />
            <h1>Your Maps</h1>

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
                    <hr />
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
                    <hr />
                    <TilesContainer
                        data={privateMaps}
                        renderTile={(tileProps) => renderTile(tileProps, openMapInfoModal)}
                        tileSize={tileSize}
                        forceTileWidth={150}
                        forceTileHeight={170}
                    />
                    <button className={styles.plusButton} onClick={openCreateModal}>
                        <img src={plus_icon} alt="Add Map" />
                    </button>
                </div>

                <div className={styles.mapColumn}>
                    <h3 className={styles.categories}>Pending Approval:</h3>
                    <hr />
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
                onPublish={(updatedMap = null) => {

                    const updatedTile = {
                        mapName: updatedMap.mapName,
                        cols: 1,
                        rows: 1,
                        status: updatedMap.mapStatus,
                        created_at: updatedMap.createdAt,
                        modified_at: updatedMap.modifiedAt,
                        published_at: updatedMap.published_at,
                        gmaps_url: updatedMap.gMapsUrl,
                        image_url: card,
                        numFavourites: updatedMap.numFavourites,
                    }
                    showToast(`Map ${selectedMap.mapName} published successfully!`);
                    setPrivateMaps((prevMaps) => prevMaps.filter(m => m.mapName !== selectedMap.mapName))
                    setPendingMaps((prevMaps) => [...prevMaps,updatedTile])
                    closeMapInfoModal()
                }}
            />

            <CreateMapModal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                addMap={addMap}
            />

            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />
            )}
        </div>
    );
}
