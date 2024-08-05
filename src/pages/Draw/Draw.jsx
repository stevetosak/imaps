import { useEffect } from "react";
import { MapBuilder } from "./scripts/MapBuilder";
import styles from "./Draw.module.css";

function Draw() {
  useEffect(() => {
    const app = new MapBuilder("container");

    document.body.style.height = "100vh";
    document.body.style.width = "100vw";
  }, []);
  return (
    <div className={styles.bodyWrap}>
      <div className={styles.wrapper}>
        <div id="container" className={styles.cont}></div>
        <div id="dropdown">
          <select id="dropdownOptions" multiple></select>
        </div>
        <div className={styles.panel}>
          <button id="add">Add Room</button>
          <div id="dropdown" className={styles.dropdownContent}>
            <select id="dropdownOptions" multiple></select>
          </div>
          <div id="selectedOption"></div>
        </div>
      </div>
    </div>
  );
}

export default Draw;
