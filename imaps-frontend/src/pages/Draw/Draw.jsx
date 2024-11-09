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

function Draw() {
  const { mapName } = useParams();
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [app, setApp] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { username } = useContext(AuthContext);
  const [floors, setFloors] = useState([]);
  const [newFloorNumber, setNewFloorNumber] = useState(0);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.has("floor")) {
      setSearchParams({ floor: "0" });
    }

    const app = new MapBuilder("container");
    setApp(app);
    app
      .loadMap(mapName, username, searchParams.get("floor"))
      .then(() => {
        loadFloors();
      })
      .catch((reason) => {
        console.log("ERRR: ", reason);
        navigate("/myMaps");
      });

    // fpsCounterLoop();
  }, []);

  const updateFloors = (floors) => {
    setFloors(floors);
  };

  const loadFloors = async () => {
    const httpService = new HttpService();
    httpService.setAuthenticated();

    try {
      const resp = await httpService.get(`/protected/floors/load?mapName=${mapName}`);
      setFloors(resp);
      console.log("RESPONSE FLOORS:", resp);
      console.log("SET", floors);
    } catch (error) {
      console.error("Error loading floors:", error);
    }
  };

  const handleFloorChange = (event) => {
    setSelectedFloor(event.target.value); //updateSearchParam("floor",event.target.value)

    setSearchParams({ floor: event.target.value });
    app
      .loadMap(mapName, username, event.target.value)
      .then((resp) => {
        console.log(resp);
      })
      .catch((reason) => {
        console.log("ERRR: ", reason);
      });
    console.log(`Floor changed to: ${event.target.value}`);
  };

  const addFloor = () => {
    const httpService = new HttpService();
    httpService.setAuthenticated();

    const payload = {
      num: newFloorNumber,
      mapName: mapName,
    };

    httpService
      .put("/protected/floors/add", payload)
      .then((resp) => console.log("Added new floor"))
      .catch((reason) => console.log(reason));
  };

  const handleSaveClick = async () => {
    const resp = await app
      .saveMap(mapName, username, selectedFloor)
      .then((r) => {
        setIsPopupVisible(true);

        setTimeout(() => {
          setIsPopupVisible(false);
        }, 3000);
      })
      .catch((reason) => {
        console.log("Error saving map:", reason);
      });
  };
  const handleLoadMapClick = (data) => {
    app.deserializeMap(data);
  };

  return (
    <div className={styles.wrapper} id="wrapper">
      {/* <SideBar></SideBar> */}
      <Logo></Logo>
      <div id="container" className={styles.cont}></div>
      <div className={styles.panel}>
        <div className={styles.topPanelH}>
          {/* <Link to="/">
            <img src={logo_img} alt="Finki Logo" className={styles.logo_img} />
          </Link> */}
          <Profile position="inline"></Profile>
        </div>
        <Link to={`/myMaps/${mapName}/View`} className={styles.titleLink}>
          <h1 className={styles.title}>{mapName}</h1>
        </Link>
        {/* <div id="fpscont" className={styles.fpscounter}>
          <p id="fpsCounter"></p>
        </div> */}
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
            onChange={handleFloorChange}
            className={styles.floorDropdown}
          >
            {floors?.map((floor) => (
              <option key={floor.floorNumber} value={floor.floorNumber}>
                Floor {floor.floorNumber}
              </option>
            ))}
          </select>

          <label htmlFor="newFloorInput">Add Floor:</label>
          <input
            type="number"
            id="newFloorInput"
            value={newFloorNumber}
            onChange={(e) => setNewFloorNumber(Number(e.target.value))}
            className={styles.floorInput}
          />
          <button onClick={addFloor} className={styles.addFloorButton}>
            Add Floor
          </button>
        </div>

        <hr />
        <br />
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
            <h2>Map Saved!</h2>
            <p>Your map has been successfully saved.</p>
          </div>
        </div>
      )}
    </div>
  );
}
export default Draw;
