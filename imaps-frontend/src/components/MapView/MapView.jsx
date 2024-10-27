import {useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {MapDisplay} from "../../scripts/main/MapDisplay.js";
import styles from "../../pages/FinkiMaps/FinkiMaps.module.css";
import SideBar from "../SideBar/SideBar.jsx";
import SearchBar from "../SearchBar/SearchBar.jsx";
import FilterBar from "../FilterBar/FilterBar.jsx";
import Profile from "../Profile/Profile.jsx";
import MapControls from "../MapControls/MapControls.jsx";
import {AuthContext} from "../AuthContext/AuthContext.jsx";
import RoomInfoPanel from "../RoomInfoPanel/RoomInfoPanel.jsx";

const MapView = () => {
    const {mapName} = useParams();
    const {username} = useContext(AuthContext);

    const [mapLoaded, setMapLoaded] = useState(false);
    const [app, setApp] = useState(null);

    useEffect(() => {
        const appInstance = new MapDisplay("map");
        appInstance.loadMap(mapName)
            .then(() => {
                setApp(appInstance);
                setMapLoaded(true);
                console.log(mapName)
            })
            .catch(reason => {
                console.log("ERROR: ", reason);
            })
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
                <h1>{mapName}</h1>
                <h1>{username}</h1>
                <SideBar/>
                <div className={styles.left}>
                    {mapLoaded && app &&
                        <>
                            <SearchBar map={app}/>
                            <FilterBar map={app}/>
                        </>
                    }

                </div>
                <div className={styles.right}>
                    <Profile/>
                </div>
            </div>

            <div className={styles.mapControlsContainer}>
                <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onFloorChange={handleFloorChange}/>
            </div>
        </div>
    );
};

export default MapView;
