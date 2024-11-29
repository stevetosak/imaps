import React, { useContext, useEffect, useState } from "react";
import styles from "./CreateMaps.module.css";
import { TilesContainer } from "react-tiles-dnd";
import MapInfoModal from "../../components/MapInfoModal/MapInfoModal.jsx";
import MapDetailsModal from "../../components/Modals/CreateMapModal/CreateMapModal.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import { AuthContext } from "../../components/AuthContext/AuthContext.jsx";
import card from "../../assets/card-map.png";


const renderTile = ({ data, isDragging }) => (
  <div style={{ padding: "1rem", width: "100%" }}>
    <div
      className={`${styles.tile} ${isDragging ? styles.dragging : ""}`}
      style={{ width: "100%", height: "100%" }}
    >
      <img src={card} className={styles.imgStyle} alt="Map Thumbnail" />
      <div style={{fontFamily: 'exo'}}>
        {data.mapName} {isDragging ? "DRAGGING" : null}
      </div>
      <div className={styles.iconContainer}>
        <Link to={`/myMaps/${data.mapName}/Draw`} className={styles.linkStyle}>
          <img src={edit_icon} className={styles.icon} alt="Edit" />
        </Link>
        <Link to={`/myMaps/${data.mapName}/View`} className={styles.linkStyle}>
          <img src={view_icon} className={styles.icon} alt="View" />
        </Link>
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
    const { username } = useContext(AuthContext);
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

    const deleteMap = (mapName) => {
        const httpService = new HttpService();
        httpService.setAuthenticated();
        console.log("USER: ", username);
        const url = `/protected/my-maps/delete?mapName=${mapName}&username=${username}`;

        httpService
            .delete(url)
            .then((response) => {
                console.log(`Map "${mapName}" deleted successfully.`, response);

                // Remove the deleted map from the tiles
                setTiles((prevTiles) => prevTiles.filter((tile) => tile.mapName !== mapName));
                setAllTiles((prevTiles) => prevTiles.filter((tile) => tile.mapName !== mapName));
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || error.message || "Unknown error";
                console.error(`Failed to delete map "${mapName}".`, errorMessage);
                alert(`Error deleting the map: ${errorMessage}`);
            });
    };

    useEffect(() => {
        const loadPublicMaps = async () => {
            const httpService = new HttpService();
            httpService.setAuthenticated();
            const resp = await httpService.get(`/protected/my-maps/display?username=${username}`);
            console.log("RESPONSE MAPS PUBLIC", resp);

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
            setAllTiles(mapTiles); // Store full list of tiles
        };
        loadPublicMaps();
    }, [username]);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setTiles(allTiles.filter((tile) => tile.mapName.toLowerCase().includes(query)));
    };

    const publicMaps = tiles.filter((tile) => tile.status === "PUBLIC");
    const privateMaps = tiles.filter((tile) => tile.status === "PRIVATE");
    const pendingMaps = tiles.filter((tile) => tile.status === "PENDING");

    return (
        <div className={styles.container}>
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

            <h3 className={styles.categories}>Public Maps:</h3>
            <hr />
            <TilesContainer
                data={publicMaps}
                renderTile={(tileProps) => renderTile(tileProps, openMapInfoModal)}
                tileSize={tileSize}
                forceTileWidth={150}
                forceTileHeight={170}
            />

            <h3 className={styles.categories}>Private Maps:</h3>
            <hr />
            <TilesContainer
                data={privateMaps}
                renderTile={(tileProps) => renderTile(tileProps, openMapInfoModal)}
                tileSize={tileSize}
                forceTileWidth={150}
                forceTileHeight={170}
            />

            <h3 className={styles.categories}>Pending Approval:</h3>
            <hr />
            <TilesContainer
                data={pendingMaps}
                renderTile={(tileProps) => renderTile(tileProps, openMapInfoModal)}
                tileSize={tileSize}
                forceTileWidth={150}
                forceTileHeight={170}
            />

            {/* Modals */}
            <MapInfoModal
                isOpen={isMapInfoModalOpen}
                onClose={closeMapInfoModal}
                map={selectedMap}
                onDelete={deleteMap}
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
