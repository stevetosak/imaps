import styles from "./CreateMaps.module.css";
import "react-tiles-dnd/esm/index.css";
import { TilesContainer } from "react-tiles-dnd";
import { Link } from "react-router-dom";
import card from "../../assets/card-map.png";
import { useContext, useEffect, useState } from "react";
import HttpService from "../../scripts/net/HttpService.js";
import MapDetailsModal from "../../components/Modals/CreateMapModal/CreateMapModal.jsx";
import { AuthContext } from "../../components/AuthContext/AuthContext.jsx";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import edit_icon from "../../assets/edit_icon_black.png";
import view_icon from "../../assets/view_icon_black.png";
import Logo from "../../components/Logo/Logo.jsx";
import Profile from "../../components/Profile/Profile.jsx";

const loadedTiles = [];


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
  </div>
);

const tileSize = (tile) => ({
  colSpan: tile.cols,
  rowSpan: tile.rows,
});

export default function CreateMaps() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mapDetails, setMapDetails] = useState(null);
  const [mapToDelete, setMapToDelete] = useState(null);
  const [tiles, setTiles] = useState(loadedTiles);
  const { username } = useContext(AuthContext);

  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsModalOpen(false);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteMap = (mapName) => {
    setMapToDelete(mapName);
    confirmDelete();
  };

  const confirmDelete = async () => {
    const httpService = new HttpService();
    await httpService.post(`/maps/delete/${mapToDelete}`);

    setTiles((prevTiles) => prevTiles.filter((tile) => tile.mapName !== mapToDelete));
    closeDeleteModal();
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
      }));

      setTiles(mapTiles);
    };
    loadPublicMaps();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    setTiles(loadedTiles.filter((tile) => tile.mapName.toLowerCase().includes(value)));
  };

  const publicMaps = tiles.filter((tile) => tile.status === "PUBLIC");
  const privateMaps = tiles.filter((tile) => tile.status === "PRIVATE");

  return (
    <>
      <div className={styles.container}>
        <h1>Your Maps</h1>
        <Logo />
        <Profile />

        <div className={styles.actionButtons}>
          <button className={styles.button} onClick={openCreateModal}>
            Create Map
          </button>
          <button className={styles.button} onClick={openDeleteModal}>
            Delete a Map
          </button>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search for maps..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <h3>Public Maps:</h3>
        <hr />
        <TilesContainer
          data={publicMaps}
          renderTile={renderTile}
          tileSize={tileSize}
          forceTileWidth={150}
          forceTileHeight={170}
        />

        <br />
        <h3>Private Maps:</h3>
        <hr />
        <TilesContainer
          data={privateMaps}
          renderTile={renderTile}
          tileSize={tileSize}
          forceTileWidth={150}
          forceTileHeight={170}
        />

        <br />
        <h3>Pending Approval:</h3>
        <button>PENDING APPROVAL TODO</button>
        <hr />
      </div>

      <MapDetailsModal isOpen={isModalOpen} onClose={closeCreateModal} onSubmit={setMapDetails} />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        maps={tiles}
        onClose={closeDeleteModal}
        onDelete={handleDeleteMap}
      />
    </>
  );
}
