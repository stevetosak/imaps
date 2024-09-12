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
  },[]);
  return (
<<<<<<< HEAD:src/pages/FinkiMaps/FinkiMaps.jsx
    <>
      <div className={styles.toolbar}>
        <div className={styles.left}>
          <SearchBar />
          <FilterBar />
        </div>
        <SideBar />
        <div className={styles.right}>
          <Profile />
        </div>
      </div>
      <Draw></Draw>
    </>
=======
    <div id="main" className={styles.main}>
      <div className={styles.toolbar}>
       <div className={styles.left}>
        <SearchBar />
        <FilterBar />
      </div>
      <SideBar />
      <div className={styles.right}>
        <Profile />
      </div>
    </div>
    <div id="map" className={styles.mapContainer}></div>
  </div>
    
>>>>>>> 22bb8f118821b732077f2201a3341e53eb62b4c1:imaps-frontend/src/pages/FinkiMaps/FinkiMaps.jsx
  );
}

export default FinkiMaps;
