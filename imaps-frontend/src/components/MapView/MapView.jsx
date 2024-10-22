import { useParams } from "react-router-dom";
import React, {useEffect, useState} from "react";
import {MapDisplay} from "../../scripts/main/MapDisplay.js";
import styles from "../../pages/FinkiMaps/FinkiMaps.module.css";
import SideBar from "../SideBar/SideBar.jsx";
import SearchBar from "../SearchBar/SearchBar.jsx";
import FilterBar from "../FilterBar/FilterBar.jsx";
import Profile from "../Profile/Profile.jsx";
import MapControls from "../MapControls/MapControls.jsx";

const MapView = () => {
    const { mapName } = useParams();

    const [app,setApp] = useState(null);

    useEffect(() => {
        const app = new MapDisplay("map");
        app.loadMap(mapName);
        setApp(app);
        console.log(mapName)
    }, []);

    const handleZoomIn = () => {
        console.log("Zooming in");
    };

    const handleZoomOut = () => {
        console.log("Zooming out");
    };

    const handleFloorChange = (floor) => {
        console.log(`Switched to floor ${floor}`);
    };

    return (
        <div id="main" className={styles.main}>
            <div id="map" className={styles.mapContainer}></div>
            <div className={styles.toolbar}>
                <SideBar />
                <div className={styles.left}>
                    <SearchBar map={app}/>
                    <FilterBar />
                </div>
                <div className={styles.right}>
                    <Profile />
                </div>
            </div>

            <div className={styles.mapControlsContainer}>
                <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onFloorChange={handleFloorChange} />
            </div>
        </div>
    );
};

export default MapView;