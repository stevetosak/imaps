import React, { useEffect } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterBar from "../../components/FilterBar/FilterBar";
import Profile from "../../components/Profile/Profile";
import styles from "./FinkiMaps.module.css";
import SideBar from "../../components/SideBar/SideBar";
import Draw from "../../pages/Draw/Draw";
import { MapDisplay } from "./scripts/MapDisplay";

function FinkiMaps() {
  useEffect(() => {
    const app = new MapDisplay("map");
    app.loadMap();
  }, []);
  return (
    <div id="main" className={styles.main}>
      <div id="map" className={styles.mapContainer}></div>
      <div className={styles.toolbar}>
        <SideBar />
        <div className={styles.left}>
          <SearchBar />
          <FilterBar />
        </div>
        <div className={styles.right}>
          <Profile />
        </div>
      </div>
    </div>
  );
}

export default FinkiMaps;
