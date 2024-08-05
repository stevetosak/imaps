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
          <ul className={styles.shapeOptions} id="shapeOptions">
            <li data-info="Entrance" className={styles.shapeOption}></li>
            <li data-info="Wall" className={styles.shapeOption}></li>
            <li data-info="Room" className={styles.shapeOption}></li>
          </ul>
          <div id="selectedOption"></div>
        </div>
      </div>
    </div>
  );
}

export default Draw;
