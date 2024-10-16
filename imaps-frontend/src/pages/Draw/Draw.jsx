import {useEffect, useState} from "react";
import {MapBuilder} from "../../scripts/main/MapBuilder.js";
import styles from "./Draw.module.css";
import RoomModal from "../../components/RoomModal/RoomModal.jsx";
import SideBar from "../../components/SideBar/SideBar.jsx";
import EntranceModal from "../../components/EntranceModal/EntranceModal.jsx";
import DrawGuide from "../../components/DrawGuide/DrawGuide.jsx";
import RoomTypeModal from "../../components/RoomTypeModal/RoomTypeModal.jsx";
import InfoPinModal from "../../components/InfoPinModal/InfoPinModal.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import SaveMap from "../../components/SaveMap/SaveMap.jsx";
import logo from "../../assets/logo_icon.png";
import MapTemplateSelector from "../../components/MapTemplateSelector/LoadMap.jsx";
import KeymapPanel from "../../components/KeyMappingsGuidePanel/KeymapPanel.jsx";

function Draw() {
    const [selectedFloor, setSelectedFloor] = useState(1);
    const [app, setApp] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    useEffect(() => {
        const app = new MapBuilder("container");
        setApp(app);
        // fpsCounterLoop();
    }, []);

    const handleFloorChange = (event) => {
        setSelectedFloor(event.target.value);
        console.log(`Floor changed to: ${event.target.value}`);
    };

    const handleRenderClick = () => {
        setIsPopupVisible(true);

        setTimeout(() => {
            setIsPopupVisible(false);
        }, 3000);
    };

    const handleSaveClick = async (mapName) => {
        const resp = await app.saveMap(mapName);
    }
    const handleLoadMapClick = (data) => {
        app.deserializeMap(data);
    }

    return (

        <div className={styles.wrapper} id="wrapper">
            <SideBar></SideBar>
            <div id="container" className={styles.cont}></div>
            <div className={styles.panel}>
                <img src={logo} alt="Finki Logo" className={styles.logo}/>
                <h1 className={styles.title}>MapBuilder</h1>
                {/* <div id="fpscont" className={styles.fpscounter}>
          <p id="fpsCounter"></p>
        </div> */}
                <div className={styles.guideWrapper}>
                    <DrawGuide/>
                </div>

                {/* <div className={styles.floorSelector}>
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
          </select>
        </div> */}
                {/* <h2 className={styles.paragraph}>Objects:</h2> */}
                <ul className={styles.shapeOptions} id="shapeOptions">
                    <li data-info="Entrance" className={`${styles.shapeOption} ${styles.entrance}`}></li>
                    <li data-info="Wall" className={`${styles.shapeOption} ${styles.wall}`} id="wall"></li>
                    <li data-info="Room" className={`${styles.shapeOption} ${styles.room}`} id="room"></li>
                </ul>

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
                    <MapTemplateSelector loadHandler={handleLoadMapClick}></MapTemplateSelector>
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
