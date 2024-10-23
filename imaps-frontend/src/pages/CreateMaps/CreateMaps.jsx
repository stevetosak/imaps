import styles from "./CreateMaps.module.css";
import "react-tiles-dnd/esm/index.css";
import {TilesContainer} from "react-tiles-dnd";
import {Link} from "react-router-dom";
import card from "../../assets/card-map.png";
import {useContext, useEffect, useState} from "react";
import HttpService from "../../scripts/net/HttpService.js";
import MapDetailsModal from "../../components/Modals/CreateMapModal/CreateMapModal.jsx";
import {AuthContext} from "../../components/AuthContext/AuthContext.jsx";

const loadedTiles = [];

const renderTile = ({data, isDragging}) => (
    <div style={{padding: "1rem", width: "100%"}}>
        <Link to={`/Maps/${data.mapName}/Draw`} className={styles.linkStyle}>
            <div
                className={`${styles.tile} ${isDragging ? styles.dragging : ""}`}
                style={{width: "100%", height: "100%"}}
            >
                <img src={card} className={styles.imgStyle} alt="Map Thumbnail"/>
                <div>
                    {data.mapName} {isDragging ? "DRAGGING" : null}
                </div>
            </div>
        </Link>
    </div>
);

const tileSize = (tile) => ({
    colSpan: tile.cols,
    rowSpan: tile.rows,
});

export default function CreateMaps() {


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mapDetails, setMapDetails] = useState(null);
    const { username } = useContext(AuthContext);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleModalSubmit = (details) => {
        console.log("Map Details Submitted:", details);
        setMapDetails(details);
    }

    useEffect(() => {
        const loadPublicMaps = async () => {
            const httpService = new HttpService();
            httpService.setAuthenticated()
            const resp = await httpService.get("/protected/maps/loadPersonal");
            console.log("RESPONSE MAPS PUBLIC", resp)

            const mapTiles = resp.maps.map(elem => ({
                mapName: elem.name,
                cols: 1,
                rows: 1
            }))

            setTiles(mapTiles);
        }
        loadPublicMaps();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [tiles, setTiles] = useState(loadedTiles);

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        setTiles(loadedTiles.filter((tile) => tile.text.toLowerCase().includes(value)));
    };

    return (
        <>
            <div className={styles.container}>
                <h1>Your Maps</h1>
                <h1> Hello {username}</h1>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search for maps..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                <TilesContainer
                    data={tiles}
                    renderTile={renderTile}
                    tileSize={tileSize}
                    forceTileWidth={150}
                    forceTileHeight={170}
                />
            </div>
            <div id="createMapButton">
                <button onClick={openModal}> Create Map</button>
            </div>

            <MapDetailsModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleModalSubmit}
            />

            <div id="requestMapPublish">
                Want others to see your map?<br/>
                <button>Publish Request</button>
            </div>

        </>
    );
}
