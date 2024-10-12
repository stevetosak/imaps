import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterBar from "../../components/FilterBar/FilterBar";
import Profile from "../../components/Profile/Profile";
import SideBar from "../../components/SideBar/SideBar";
import Draw from "../../pages/Draw/Draw";
import { MapDisplay } from "../../scripts/main/MapDisplay.js";
import MapControls from "../../components/MapControls/MapControls";
import styles from "./FinkiMaps.module.css";

function FinkiMaps() {
  const [app,setApp] = useState(null);

  useEffect(() => {
    const app = new MapDisplay("map");
    app.loadMap();
    setApp(app);
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
}

export default FinkiMaps;
