import styles from "./Maps.module.css";
import "react-tiles-dnd/esm/index.css";
import {TilesContainer} from "react-tiles-dnd";
import {Link} from "react-router-dom";
import card from "../../assets/card-map.png";
import {useEffect, useState} from "react";
import HttpService from "../../scripts/net/HttpService.js";

const loadedTiles = [];

const renderTile = ({data, isDragging}) => (
    <div style={{padding: "1rem", width: "100%"}}>
        <Link to={`/Maps/${data.text}/View`} className={styles.linkStyle}>
            <div
                className={`${styles.tile} ${isDragging ? styles.dragging : ""}`}
                style={{width: "100%", height: "100%"}}
            >
                <img src={card} className={styles.imgStyle} alt="Map Thumbnail"/>
                <div>
                    {data.text} {isDragging ? "DRAGGING" : null}
                </div>
            </div>
        </Link>
    </div>
);

const tileSize = (tile) => ({
    colSpan: tile.cols,
    rowSpan: tile.rows,
});

export default function Maps() {
    useEffect(() => {
        const loadPublicMaps = async () => {
            const httpService = new HttpService();
            const resp = await httpService.get("/public/maps/display");
            console.log("RESPONSE MAPS PUBLIC", resp)

            const mapTiles = resp.map(elem => ({
                text: elem.name,
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
        <div className={styles.container}>
            <h1>Explore Maps</h1>

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
    );
}
