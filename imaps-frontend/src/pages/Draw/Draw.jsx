import { useContext, useEffect, useState } from "react";
import { MapBuilder } from "../../scripts/main/MapBuilder.js";
import styles from "./Draw.module.css";
import RoomModal from "../../components/Modals/RoomModal/RoomModal.jsx";
import SideBar from "../../components/SideBar/SideBar.jsx";
import EntranceModal from "../../components/Modals/EntranceModal/EntranceModal.jsx";
import DrawGuide from "../../components/DrawGuide/DrawGuide.jsx";
import RoomTypeModal from "../../components/Modals/RoomTypeModal/RoomTypeModal.jsx";
import InfoPinModal from "../../components/Modals/InfoPinModal/InfoPinModal.jsx";
import SaveMap from "../../components/SaveMap/SaveMap.jsx";
import Logo from "../../components/Logo/Logo.jsx";
import logo_img from "../../assets/logo_icon.png";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Profile from "../../components/Profile/Profile.jsx";
import { AuthContext } from "../../components/AuthContext/AuthContext.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import StairsModal from "../../components/Modals/StairsModal/StairsModal.jsx";
import {MapDisplay} from "../../scripts/main/MapDisplay.js";
import netconfig from "../../scripts/net/netconfig.js";
import useMapLoader from "./Hooks/useMapLoader.js";
import plus_icon from "../../assets/plus_icon.png"

function Draw() {
  const { mapName } = useParams();
  const { username } = useContext(AuthContext);

  //const [app, setApp] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  //const [floors, setFloors] = useState([]);
  const [formNewFloorNum, setFormNewFloorNum] = useState(0);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [hasError, setHasError] = useState(false);
  const [mapLoaded,setMapLoaded] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const {app,floors,saveFloor} = useMapLoader(mapName,username,searchParams,setSearchParams)


  const addFloorHandler = async (newFloorNum) => {
    const httpService = new HttpService();
    httpService.setAuthenticated();

    const payload = {
      num: newFloorNum,
      mapName: mapName,
    };

    try {
      await httpService.put("/protected/floors/add", payload);
      console.log(`Added floor ${newFloorNum}`);
      // Update the local floors state dynamically
      setFloors((prevFloors) => [...prevFloors, { num: newFloorNum }]);
    } catch (error) {
      console.error("Error adding floor:", error);
    }
  };

  const deleteFloorHandler = async (floorNum) => {
    const httpService = new HttpService();
    httpService.setAuthenticated();

    try {
      await httpService.delete(`/protected/floors/delete/${floorNum}`, {
        data: { mapName: mapName },
      });
      console.log(`Deleted floor ${floorNum}`);
    } catch (error) {
      console.error("Error deleting floor:", error);
    }
  };


  const handleSaveClick = async () => {
    saveFloor().then(r => {
     floors.forEach(flr => {
       setIsPopupVisible(true);
       setTimeout(() => {
         setIsPopupVisible(false);},
           3000);
       console.log("floor after save: " + JSON.stringify(flr))
     })
    });


  };

  return (
    <div className={styles.wrapper} id="wrapper">
      {/* <SideBar></SideBar> */}
      <Logo></Logo>
      <div id="container" className={styles.cont}></div>
      <div className={styles.panel}>
        <div className={styles.topPanelH}>
          <Profile position="inline"></Profile>
        </div>
        <Link to={`/myMaps/${mapName}/View`} className={styles.titleLink}>
          <h1 className={styles.title}>{mapName}</h1>
        </Link>
        <div className={styles.guideWrapper}>
          <DrawGuide/>
        </div>
        <hr/>
        <br/>
        {/* {<h2 className={styles.paragraph}>Objects:</h2>} */}
        <ul className={styles.shapeOptions} id="shapeOptions">
          <li data-info="Entrance" className={`${styles.shapeOption} ${styles.entrance}`}></li>
          <li data-info="Wall" className={`${styles.shapeOption} ${styles.wall}`} id="wall"></li>
          <li data-info="Room" className={`${styles.shapeOption} ${styles.room}`} id="room"></li>
          <li data-info="Stairs" className={`${styles.shapeOption} ${styles.stairs}`} id="stairs"></li>
        </ul>
        <RoomTypeModal map={app}></RoomTypeModal>
        <br/>
        <hr/>
        <br/>
        <div className={styles.floorSection}>
          <div className={styles.floorList}>
            <label className={styles.floorLabel}>Available Floors:</label>
            <div className={styles.floorItems}>
              {/* Add new positive floor above */}
              <button
                  className={styles.addFloorButton}
                  onClick={() => {
                    const newFloor = Math.max(...floors.map((f) => f.num)) + 1;
                    addFloorHandler(newFloor);
                  }}
              >
                <img src={plus_icon} alt="Add Positive Floor" className={styles.icon}/>
              </button>

              {/* Display editable floors */}
              {floors
                  .sort((a, b) => b.num - a.num)
                  .map((floor) => (
                      <div key={floor.num} className={styles.floorItemWrapper}>
                        <button
                            onClick={() => setSearchParams({floor: floor.num})}
                            className={`${styles.floorItem} ${
                                searchParams.get("floor") == floor.num ? styles.activeFloor : ""
                            }`}
                        >
                          Floor {floor.num}
                        </button>
                        <button
                            className={styles.deleteFloorButton}
                            onClick={() => deleteFloorHandler(floor.num)}
                        >
                          🗑️
                        </button>
                      </div>
                  ))}

              {/* Add new negative floor below */}
              <button
                  className={styles.addFloorButton}
                  onClick={() => {
                    const newFloor = Math.min(...floors.map((f) => f.num)) - 1;
                    addFloorHandler(newFloor);
                  }}
              >
                <img src={plus_icon} alt="Add Negative Floor" className={styles.icon}/>
              </button>
            </div>
          </div>
        </div>

        <br/>

        <hr/>
        <br/>
        {hasError && <p style={{color: "red", textAlign: "center"}}>{errorMessage}</p>}
        <div className={styles.templateCont}>
          <SaveMap submitHandler={handleSaveClick}></SaveMap>
          {/*<MapTemplateSelector loadHandler={handleLoadMapClick}></MapTemplateSelector>*/}
        </div>

        <div className={styles.hide}>
          <RoomModal map={app}></RoomModal>
          <EntranceModal map={app}></EntranceModal>
          <InfoPinModal map={app}></InfoPinModal>
          <StairsModal map={app}></StairsModal>
        </div>
      </div>

      {isPopupVisible && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h2>Map Saved!</h2>
              <p>Your map has been successfully saved.</p>
            </div>
          </div>
      )}
    </div>
  );
}

export default Draw;
