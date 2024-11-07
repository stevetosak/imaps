import React, {useEffect, useState} from "react";
import styles from "./MapControls.module.css";
import plusIcon from "../../assets/plus_icon.png";
import minusIcon from "../../assets/minus_icon.png";
import floorIcon from "../../assets/floor_icon.png";
import HttpService from "../../scripts/net/HttpService.js";

export default function MapControls({onFloorChange,mapName }) {
  const [currentFloor, setCurrentFloor] = useState(0);
  const [floors, setFloors] = useState([]);

  // Starting floor

  // Handle floor selection
  const handleFloorChange = (newFloor) => {
    setCurrentFloor(newFloor);
    if (onFloorChange) {
      onFloorChange(newFloor);
    }
  };

  return (
    <div className={styles.mapControl}>
      {/* Zoom Controls */}
      <div className={styles.zoomControls}>
        <button className={styles.zoomButton}>
          <img src={plusIcon} alt="Zoom In" />
        </button>
        <button className={styles.zoomButton}>
          <img src={minusIcon} alt="Zoom Out" />
        </button>
      </div>

      {/* Floor Selector */}
      {/*<div className={styles.floorSelector}>*/}
      {/*  <img src={floorIcon} alt="Floor Icon" className={styles.floorIcon} />*/}
      {/*  <select*/}
      {/*    value={currentFloor}*/}
      {/*    onChange={(e) => handleFloorChange(parseInt(e.target.value, 10))}*/}
      {/*    className={styles.floorDropdown}*/}
      {/*  >*/}
      {/*    {floors?.map(floor => (*/}
      {/*        <option key={floor.floorNumber} value={floor.floorNumber}>*/}
      {/*          {floor.floorNumber}F*/}
      {/*        </option>*/}

      {/*    ))}*/}
      {/*    /!*<option value={1}>1F</option>*!/*/}
      {/*    /!*<option value={2}>2F</option>*!/*/}
      {/*    /!*<option value={3}>3F</option>*!/*/}
      {/*    /!*<option value={4}>4F</option>*!/*/}
      {/*  </select>*/}
      {/*</div>*/}
    </div>
  );
}
