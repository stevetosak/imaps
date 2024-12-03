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


  const addFloor = () => {
    const httpService = new HttpService();
    httpService.setAuthenticated();

    const payload = {
      num: formNewFloorNum,
      mapName: mapName,
    };

    httpService
      .put("/protected/floors/add", payload)
      .then((resp) => console.log("Added new floor"))
      .catch((reason) => console.log(reason));
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
          <DrawGuide />
        </div>
        <hr />
        <br />
        {/* {<h2 className={styles.paragraph}>Objects:</h2>} */}
        <ul className={styles.shapeOptions} id="shapeOptions">
          <li data-info="Entrance" className={`${styles.shapeOption} ${styles.entrance}`}></li>
          <li data-info="Wall" className={`${styles.shapeOption} ${styles.wall}`} id="wall"></li>
          <li data-info="Room" className={`${styles.shapeOption} ${styles.room}`} id="room"></li>
          <li data-info="Stairs" className={`${styles.shapeOption} ${styles.stairs}`} id="stairs"></li>
        </ul>
        <RoomTypeModal map={app}></RoomTypeModal>
        <br />
        <hr />
        <br />
        <div className={styles.floorSection}>
          <label htmlFor="floorSelect">Select Floor:</label>
          <select
            id="floorSelect"
            value={searchParams.get("floor")}
            onChange={(e) => {setSearchParams({floor: e.target.value})}}
            className={styles.floorDropdown}
          >
            {floors.map((floor) => (
              <option key={floor.num} value={floor.num}>
                Floor {floor.num}
              </option>
            ))}
          </select>

          <label htmlFor="newFloorInput">Add Floor:</label>
          <input
            type="number"
            id="newFloorInput"
            value={formNewFloorNum}
            onChange={(e) => setFormNewFloorNum(Number(e.target.value))}
            className={styles.floorInput}
          />
          <button onClick={addFloor} className={styles.addFloorButton}>
            Add Floor
          </button>
        </div>

        <hr />
        <br />
        {hasError && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}
        <div className={styles.templateCont}>
          <SaveMap submitHandler={handleSaveClick}></SaveMap>
          {/*<MapTemplateSelector loadHandler={handleLoadMapClick}></MapTemplateSelector>*/}
        </div>

        <div className={styles.hide}>
          <RoomModal map={app}></RoomModal>
          <EntranceModal map={app}></EntranceModal>
          <InfoPinModal map={app}></InfoPinModal>
          <StairsModal map = {app}></StairsModal>
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
