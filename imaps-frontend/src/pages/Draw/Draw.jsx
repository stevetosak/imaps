import {useContext, useEffect, useState} from "react";
import { MapBuilder } from "../../scripts/main/MapBuilder.js";
import styles from "./Draw.module.css";
import RoomModal from "../../components/Modals/RoomModal/RoomModal.jsx";
import SideBar from "../../components/SideBar/SideBar.jsx";
import EntranceModal from "../../components/Modals/EntranceModal/EntranceModal.jsx";
import DrawGuide from "../../components/DrawGuide/DrawGuide.jsx";
import RoomTypeModal from "../../components/Modals/RoomTypeModal/RoomTypeModal.jsx";
import InfoPinModal from "../../components/Modals/InfoPinModal/InfoPinModal.jsx";
import SaveMap from "../../components/SaveMap/SaveMap.jsx";
import logo from "../../assets/logo_icon.png";
import {Link, useParams} from "react-router-dom";
import Profile from "../../components/Profile/Profile.jsx";
import {AuthContext} from "../../components/AuthContext/AuthContext.jsx";
import HttpService from "../../scripts/net/HttpService.js";

function Draw() {

  const { mapName} = useParams();
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [app, setApp] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const {username} = useContext(AuthContext);
  const [floors,setFloors] = useState([]);
  const [newFloorNumber,setNewFloorNumber] = useState(0);
  useEffect(() => {
    const app = new MapBuilder("container");
    setApp(app);
    app.loadMap(mapName,username,0)
        .then(resp => console.log(resp))
        .catch(reason => {
          console.log("ERRR: ",reason)
        })

    const loadFloors = async () => {
      const httpService = new HttpService();
      httpService.setAuthenticated();

      try {
        const resp = await httpService.get(`/protected/myMaps/loadAllFloors?mapName=${mapName}`);
        setFloors(resp)
        console.log("RESPONSE FLOORS:", resp);
        console.log("SET",floors)
      } catch (error) {
        console.error("Error loading floors:", error);
      }
    };

    loadFloors();

    // fpsCounterLoop();
  }, []);

  const updateFloors = (floors) => {
    setFloors(floors)
  }

  const handleFloorChange = (event) => {
    setSelectedFloor(event.target.value);
    app.loadMap(mapName,username,event.target.value)
        .then(resp => {
          console.log(resp)
        })
        .catch(reason => {
          console.log("ERRR: ",reason)
        })
    console.log(`Floor changed to: ${event.target.value}`);
  };

  const handleRenderClick = () => {
    setIsPopupVisible(true);

    setTimeout(() => {
      setIsPopupVisible(false);
    }, 3000);
  };

  const addFloor = () => {
    const httpService = new HttpService()
    httpService.setAuthenticated();

    const payload = {
      num: newFloorNumber,
      mapName: mapName
    }

    httpService.put("/protected/myMaps/addFloor",payload).then((resp) => console.log("Added new floor")).catch(reason => console.log(reason));

  }

  const handleSaveClick = async () => {
    const resp = await app.saveMap(mapName,username,selectedFloor);
  };
  const handleLoadMapClick = (data) => {
    app.deserializeMap(data);
  };

  return (
    <div className={styles.wrapper} id="wrapper">
      <SideBar></SideBar>
      <div id="container" className={styles.cont}></div>
      <div className={styles.panel}>
        <div className={styles.topPanelH}>
          <Link to="/">
            <img src={logo} alt="Finki Logo" className={styles.logo}/>
          </Link>
          <Profile></Profile>
        </div>

        <h1 className={styles.title}>Map Builder</h1>
        {/* <div id="fpscont" className={styles.fpscounter}>
          <p id="fpsCounter"></p>
        </div> */}
        <div className={styles.guideWrapper}>
          <DrawGuide/>
        </div>
        {<div className={styles.floorSelector}>
          <label htmlFor="floorSelect">Select Floor:</label>
          <select
              id="floorSelect"
              value={selectedFloor}
              onChange={handleFloorChange}
              className={styles.floorDropdown}
          >
            {floors?.map(floor => (
                <option key={floor.id} value={floor.floorNumber}>
                  Floor {floor.floorNumber}
                </option>
            ))}
          </select>
        </div>}
        <div>
          <label htmlFor="newFloorInput">Add Floor:</label>
          <input
              type="number"
              id="newFloorInput"
              value={newFloorNumber} // Bind input value to state
              onChange={(e) => setNewFloorNumber(Number(e.target.value))} // Update state on input change
          />
          <button onClick={addFloor}>Add Floor</button>
          {/* Trigger addFloor on button click */}
        </div>
        {<h2 className={styles.paragraph}>Objects:</h2>}
        <ul className={styles.shapeOptions} id="shapeOptions">
          <li data-info="Entrance" className={`${styles.shapeOption} ${styles.entrance}`}></li>
          <li data-info="Wall" className={`${styles.shapeOption} ${styles.wall}`} id="wall"></li>
          <li data-info="Room" className={`${styles.shapeOption} ${styles.room}`} id="room"></li>
        </ul>
        <br/>
        <RoomTypeModal map={app}></RoomTypeModal>

        <div id="render" className={styles.buttonContainer}>
          <button
              id="render-button"
              type="button"
              className={styles.renderButton}
              onClick={handleRenderClick}
          >
            Render
          </button>
        </div>
        <div className={styles.templateCont}>
          <SaveMap submitHandler={handleSaveClick}></SaveMap>
          {/*<MapTemplateSelector loadHandler={handleLoadMapClick}></MapTemplateSelector>*/}
        </div>

        <div className={styles.hide}>
          <RoomModal map={app}></RoomModal>
          <EntranceModal map={app}></EntranceModal>
          <InfoPinModal map={app}></InfoPinModal>
        </div>
      </div>

      {isPopupVisible && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h2>Map Rendered!</h2>
              <p>Your map has been successfully rendered.</p>
            </div>
          </div>
      )}
    </div>
  );
}

export default Draw;
