import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { MapDisplay } from "../../scripts/main/MapDisplay.js";
import styles from "./MapView.module.css";
import SideBar from "../../components/SideBar/SideBar.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import FilterBar from "../../components/FilterBar/FilterBar.jsx";
import Profile from "../../components/Profile/Profile.jsx";
import MapControls from "../../components/MapControls/MapControls.jsx";
import { AuthContext } from "../../components/AuthContext/AuthContext.jsx";
import RoomInfoPanel from "../../components/RoomInfoPanel/RoomInfoPanel.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import floorIcon from "../../assets/floor_icon.png";
import Logo from "../../components/Logo/Logo.jsx";

const MapView = ({ isPrivate }) => {
  const { mapName } = useParams();
  const { username } = useContext(AuthContext);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [app, setApp] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [floors, setFloors] = useState([]);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();


  useEffect(() => {
    if (!searchParams.has("floor")) {
      setSearchParams({ floor: "0" });
    }

    const appInstance = new MapDisplay("map");
    appInstance
      .loadMap(mapName, searchParams.get("floor"), username, isPrivate)
      .then(() => {
        setApp(appInstance);
        setMapLoaded(true);
        loadFloors()
            .then(fs => console.log("loaded floors; " + fs))
            .catch(reason => console.log("error loading floors: " + reason))
        console.log(mapName);
      })
      .catch((reason) => {
        console.log("Error loading map: ", reason);
        navigate("/myMaps");
      });


  }, [isPrivate, mapName]);

  useEffect(() =>
  {
    const openRoomInfoPanel = (e) => {
      setSelectedRoom(e.detail.room);
      setIsPanelOpen(true)

    }
    window.addEventListener("openRoomInfoPanel", openRoomInfoPanel);

    return () => window.removeEventListener("openRoomInfoPanel", openRoomInfoPanel);
  })

  const loadFloors = async () => {
    const httpService = new HttpService();

    try {
      const resp = await httpService.get(`/public/floors/get`);
      setFloors(resp);
      return resp;
    } catch (error) {
      console.error("Error loading floors:", error);
    }
  };

  const handleFloorChange = (floorNum) => {
    setSearchParams({ floor: floorNum });
    app
      .loadMap(mapName, floorNum, username, isPrivate)
      .then((resp) => {
        console.log(resp);
      })
      .catch((reason) => {
        console.log("ERRR: ", reason);
      });
    console.log(`Floor changed to: ${floorNum}`);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  const onNavigate = () => {

  };

  return (
    <div id="main" className={styles.main}>
      <div id="map" className={styles.mapContainer}></div>

      <RoomInfoPanel isOpen={isPanelOpen} onClose={closePanel} floor={searchParams.get("floor") } room={selectedRoom} />
      <div className={styles.toolbar}>
        {/* <h1>{username}</h1> */}
        {/* <SideBar /> */}
        <div className={styles.left}>
          <Logo></Logo>
          <h1>{mapName}</h1>
          {mapLoaded && app && (
            <>
              <SearchBar map={app} />
              <FilterBar map={app} />
            </>
          )}
        </div>
        <Profile />
      </div>
      <div className={styles.mapControlsContainer}>
        {/*<MapControls*/}
        {/*    floors={floors}*/}
        {/*    onFloorChange={handleFloorChange}*/}
        {/*/>*/}

        <div className={styles.floorSelector}>
          <img src={floorIcon} alt="Floor Icon" className={styles.floorIcon} />
          <select
            value={searchParams.get("floor")}
            onChange={(e) => handleFloorChange(parseInt(e.target.value, 10))}
            className={styles.floorDropdown}
          >
            {floors?.map((floor) => (
              <option key={floor.floorNumber} value={floor.floorNumber}>
                {floor.floorNumber}F
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MapView;
