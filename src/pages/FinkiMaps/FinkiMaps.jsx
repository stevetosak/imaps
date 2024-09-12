import React from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterBar from "../../components/FilterBar/FilterBar";
import Profile from "../../components/Profile/Profile";
import styles from "./FinkiMaps.module.css";
import SideBar from "../../components/SideBar/SideBar";
import Draw from "../../pages/Draw/Draw";

function FinkiMaps() {
  return (
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
  );
}

export default FinkiMaps;
