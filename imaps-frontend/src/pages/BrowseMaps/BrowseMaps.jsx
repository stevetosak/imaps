import styles from "./Maps.module.css";
import "react-tiles-dnd/esm/index.css";
import {TilesContainer} from "react-tiles-dnd";
import {Link} from "react-router-dom";
import card from "../../assets/card-map.png";
import star_icon from "../../assets/star_icon.png"; // Unfilled star icon
import star_filled_icon from "../../assets/star_filled_icon.png"; // Filled star icon
import {useEffect, useState} from "react";
import HttpService from "../../scripts/net/HttpService.js";
import Logo from "../../components/Logo/Logo.jsx";
import Profile from "../../components/Profile/Profile.jsx";
import config from "../../scripts/net/netconfig.js";
import {useAppContext} from "../../components/AppContext/AppContext.jsx";
import FilterMaps from "../../components/FilterMaps/FilterMaps.jsx";

let loadedTiles = [];

const renderTile = ({data, isDragging, toggleFavorite}) => (
    <div style={{padding: "1rem", width: "100%", position: "relative"}}>
        <Link to={`/Maps/View/${data.text}`} className={styles.linkStyle}>
            <div
                className={`${styles.tile} ${isDragging ? styles.dragging : ""}`}
                style={{width: "100%", height: "100%"}}
            >
                <img src={card} className={styles.imgStyle} alt="Map Thumbnail"/>
                <div style={{fontFamily: "exo"}}>
                    {data.text} {isDragging ? "DRAGGING" : null}
                </div>
            </div>
        </Link>
        <div className={styles.favorite} onClick={() => toggleFavorite(data.text, data.isFavorite)}>
            <img
                src={data.isFavorite ? star_filled_icon : star_icon}
                alt="Favorite Icon"
                style={{width: "20px", height: "20px"}}
            />
        </div>
    </div>
);

const tileSize = (tile) => ({
    colSpan: tile.cols,
    rowSpan: tile.rows,
});

export default function BrowseMaps() {
    const [searchTerm, setSearchTerm] = useState("");
    const [tiles, setTiles] = useState([]);
    const {username, isAuthenticated} = useAppContext();
    const [filter, setFilter] = useState("all")
    const [mapFilters, setMapFilters] = useState([])

    useEffect(() => {
        const loadMaps = async () => {
            const httpService = new HttpService();
            let mapTiles = [];
            let mapTypes = ['Hospital', 'Faculty', 'House', 'Other'];
            if (isAuthenticated) {
                // :D
                const favResp = await httpService.get(`${config.favourites.display}?username=${username}`);
                console.log("RESPONSE FAVORITE MAPS", favResp);

                const favMapTiles = favResp.map((elem) => ({
                    text: elem.mapName,
                    cols: 1,
                    rows: 1,
                    isFavorite: true,
                    type: elem.mapType,
                }));

                console.log("TUKA")
                // Load all maps
                const allResp = await httpService.get(config.view_maps.display);
                console.log("RESPONSE MAPS PUBLIC", allResp);

                // mapTypes = allResp.filter(elem => elem.mapType != null && elem.mapType !== "").map(elem => elem.mapType);


                const nonFavMapTiles = allResp
                    .filter((elem) => !favMapTiles.some((fav) => fav.text === elem.mapName))
                    .map((elem) => ({
                        text: elem.mapName,
                        cols: 1,
                        rows: 1,
                        isFavorite: false,
                        type: elem.mapType,
                    }));


                mapTiles = [...favMapTiles, ...nonFavMapTiles];
            } else {
                const allResp = await httpService.get(config.view_maps.display);
                console.log("RESPONSE MAPS PUBLIC", allResp);
                // mapTypes = allResp.filter(elem => elem.mapType != null && elem.mapType !== "").map(elem => elem.mapType);

                mapTiles = allResp.map((elem) => ({
                    text: elem.mapName,
                    cols: 1,
                    rows: 1,
                    isFavorite: false,
                    type: elem.mapType,
                }));
            }

            console.log("TYPES:", mapTypes);
            setMapFilters(mapTypes);

            loadedTiles = [...mapTiles];
            sortTiles(mapTiles);
            setTiles(mapTiles);
        };
        loadMaps();
    }, [isAuthenticated, username]);

    const toggleFavorite = async (tileName, isFavorite) => {
        const httpService = new HttpService();
        const url = isFavorite
            ? `${config.favourites.delete}?username=${username}&mapName=${encodeURIComponent(tileName)}`
            : `${config.favourites.add}?username=${username}&mapName=${encodeURIComponent(tileName)}`;

        console.log("Request URL:", url);
        let response;
        if (isFavorite) {
            response = await httpService.delete(url);
        } else {
            response = await httpService.post(url);
        }
        console.log("Response received:", response);

        const updatedTiles = tiles.map((tile) =>
            tile.text === tileName ? {...tile, isFavorite: !tile.isFavorite} : tile
        );

        loadedTiles = [...updatedTiles];
        sortTiles(updatedTiles);
        setTiles(updatedTiles);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filteredTiles = loadedTiles.filter((tile) =>
            tile.text.toLowerCase().includes(value)
        );
        sortTiles(filteredTiles);
        setTiles(filteredTiles);
    };

    const sortTiles = (tilesToSort) => {
        tilesToSort.sort((a, b) => {
            if (a.isFavorite === b.isFavorite) return a.text.localeCompare(b.text);
            return a.isFavorite ? -1 : 1;
        });
    };

    const onFilter = (selectedFilter) => {
        setFilter(selectedFilter);

        if (selectedFilter === "all") {
            // Show all tiles
            setTiles(loadedTiles);
        } else {
            // Filter tiles by selected type
            const filteredTiles = loadedTiles.filter((tile) => tile.type === selectedFilter);
            setTiles(filteredTiles);
        }
    };


    return (
        <div className={styles.container}>
            <h1>Explore Maps</h1>
            <Logo></Logo>
            <Profile></Profile>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search for maps..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

            </div>
            <div className={styles.filterBar}>
            <FilterMaps mapTypes={mapFilters} setFilter={onFilter}></FilterMaps>
            </div>
            {filter !== "all" && tiles.length === 0 && <p>No maps of type {filter} found</p>}
            <TilesContainer
                data={tiles}
                renderTile={(props) => renderTile({...props, toggleFavorite})}
                tileSize={tileSize}
                forceTileWidth={170}
                forceTileHeight={200}
            />
        </div>
    );
}
