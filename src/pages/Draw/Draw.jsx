import { useEffect } from "react";
import { MapBuilder } from "./scripts/MapBuilder";
import styles from "./Draw.module.css";
import InfoNode from './scripts/InfoNode'

function Draw() {
  useEffect(() => {
    const app = new MapBuilder("container");
    document.body.style.height = "100vh";
    document.body.style.width = "100vw";
  }, []);
  return (
    <div className={styles.wrapper}>
        <div id="container" className={styles.cont}></div>
        <div className={styles.panel}>
          <ul className={styles.shapeOptions} id="shapeOptions">
            <li data-info="Entrance"  className={`${styles.shapeOption} ${styles.entrance}`} >Entrance</li>
            <li data-info="Wall" className={`${styles.shapeOption} ${styles.wall}`} id="wall">Wall</li>
            <li data-info="Room"  className={`${styles.shapeOption} ${styles.room}`} id="room">Room</li>
          </ul>
          <div id="selectedOption"></div>
        </div>
      
    </div>
  );
}

export default Draw;
