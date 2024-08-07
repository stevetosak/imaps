import { useEffect } from "react";
import { MapBuilder } from "./scripts/MapBuilder";
import styles from "./Draw.module.css";
import InfoNode from './scripts/InfoNode'

function Draw() {
  useEffect(() => {
    const app = new MapBuilder("container");
  }, []);
  return (
    <div className={styles.wrapper} id="wrapper">
      <div id="container" className={styles.cont}></div>
        {/* <div id='nodeOptions' className={styles.nodeOptions}>
          <input type="text" placeholder="Room Name:"></input>
          <input type="text" placeholder="Room Type"></input>
          <input type="text" placeholder="Description"></input>
        </div> */}
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
