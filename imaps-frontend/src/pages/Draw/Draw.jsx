import { useEffect, useState } from "react";
import { MapBuilder } from "./scripts/MapBuilder";
import styles from "./Draw.module.css";
import { fpsCounterLoop } from "./scripts/util/FpsCounter.js";
import RoomModal from "../../components/RoomModal/RoomModal.jsx";
import SideBar from "../../components/SideBar/SideBar.jsx";
import EntranceModal from "../../components/EntranceModal/EntranceModal.jsx";
import DrawGuide from "../../components/DrawGuide/DrawGuide.jsx";
import RoomTypeModal from "../../components/RoomTypeModal/RoomTypeModal.jsx";
import InfoPinModal from "../../components/InfoPinModal/InfoPinModal.jsx";

function Draw() {

  const [selectedFloor, setSelectedFloor] = useState(1);
  const [app,setApp] = useState(null);

  useEffect(() => {
    const app = new MapBuilder("container");
    setApp(app);
    fpsCounterLoop();
  }, []);

  const handleFloorChange = (event) => {
    setSelectedFloor(event.target.value);
    console.log(`Floor changed to: ${event.target.value}`);
  };

  return (
    <div className={styles.wrapper} id="wrapper">
      <SideBar></SideBar>
      <div id="container" className={styles.cont}></div>
      <div className={styles.panel}>
        <h1>Welcome, User</h1>

        <div id="fpscont" className={styles.fpscounter}>
          <p id="fpsCounter"></p>
        </div>
        <div className={styles.floorSelector}>
          <label htmlFor="floorSelect">Select Floor:</label>
          <select
            id="floorSelect"
            value={selectedFloor}
            onChange={handleFloorChange}
            className={styles.floorDropdown}
          >
            <option value={1}>1st Floor</option>
            <option value={2}>2nd Floor</option>
            <option value={3}>3rd Floor</option>
            <option value={4}>4th Floor</option>
            {}
          </select>
        </div>
        <h2>Objects:</h2>
        <ul className={styles.shapeOptions} id="shapeOptions">
          <li data-info="Entrance" className={`${styles.shapeOption} ${styles.entrance}`}>
            Entrance
          </li>
          <li data-info="Wall" className={`${styles.shapeOption} ${styles.wall}`} id="wall">
            Wall
          </li>
          <li data-info="Room" className={`${styles.shapeOption} ${styles.room}`} id="room">
            Room
          </li>
        </ul>
        <RoomModal></RoomModal>
        <EntranceModal></EntranceModal>
        <DrawGuide></DrawGuide>
        <InfoPinModal map={app}></InfoPinModal>
        <RoomTypeModal map={app}></RoomTypeModal>
        <div id="render" className={styles.buttonContainer}>
          <button id="render-button" type="button" className={styles.renderButton}>
            Render
          </button>
        </div>
      </div>
    </div>
  );
}

export default Draw;
