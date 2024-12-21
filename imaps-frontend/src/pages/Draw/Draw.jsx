import {useContext, useEffect, useState} from "react";
import styles from "./Draw.module.css";
import RoomModal from "../../components/Modals/RoomModal/RoomModal.jsx";
import EntranceModal from "../../components/Modals/EntranceModal/EntranceModal.jsx";
import DrawGuide from "../../components/DrawGuide/DrawGuide.jsx";
import RoomTypeModal from "../../components/Modals/RoomTypeModal/RoomTypeModal.jsx";
import InfoPinModal from "../../components/Modals/InfoPinModal/InfoPinModal.jsx";
import SaveMap from "../../components/SaveMap/SaveMap.jsx";
import Logo from "../../components/Logo/Logo.jsx";
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import Profile from "../../components/Profile/Profile.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import StairsModal from "../../components/Modals/StairsModal/StairsModal.jsx";
import useMapLoader from "./Hooks/useMapLoader.js";
import {FloorSelector} from "./FloorSelector.jsx";
import {useRoomTypesLoader} from "./Hooks/useRoomTypesLoader.js";
import {useAppContext} from "../../components/AppContext/AppContext.jsx";
import config from "../../scripts/net/netconfig.js";
import ShapeRegistry from "../../scripts/util/ShapeRegistry.js";
import {TopPanel} from "./TopPanel/TopPanel.jsx";

function Draw() {
    const {mapName} = useParams();
    const {username} = useAppContext();

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Error");
    const [hasError, setHasError] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const [roomTypes, setRoomTypes] = useState([]);

    const {app, floors, saveFloor, setFloors} = useMapLoader(mapName, username, searchParams, setSearchParams)
    const {addRoomType} = useRoomTypesLoader(setRoomTypes, mapName, username);

    const addFloorHandler = async (newFloorNum) => {
        const httpService = new HttpService();
        httpService.setAuthenticated();

        const payload = {
            num: newFloorNum,
            mapName: mapName,
        };

        try {
            await httpService.put(`${config.floors.add}`, payload);
            console.log(`Added floor ${newFloorNum}`);
            setFloors((prevFloors) => [...prevFloors, {num: newFloorNum}]);
        } catch (error) {
            console.error("Error adding floor:", error);
        }
    };

    const deleteFloorHandler = async (floorNum) => {
        if (floorNum === 0) return

        const httpService = new HttpService();
        httpService.setAuthenticated();

        try {
            await httpService.delete(`${config.floors.delete}?floorNum=${floorNum}&mapName=${mapName}`);
            setFloors((prevFloors) => prevFloors.filter(f => f.num !== floorNum))

            const currFloor = searchParams.get("floor");
            if (currFloor == floorNum) {
                setSearchParams({floor: "0"}, {replace: true})
            }
            console.log(`Deleted floor ${floorNum}`);
        } catch (error) {
            console.error("Error deleting floor:", error);
        }
    };

    useEffect(() => {
        return () => {
            ShapeRegistry.clear();
        }
    }, []);


    const handleSaveClick = async () => {
        saveFloor()
        setIsPopupVisible(true);
        setTimeout(() => {
                setIsPopupVisible(false);
            },
            3000);
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
                <Link to={`/myMaps/View/${mapName}`} className={styles.titleLink}>
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
                <RoomTypeModal map={app} roomTypes={roomTypes} addRoomTypeDB={addRoomType}></RoomTypeModal>
                <br/>
                <hr/>
                <br/>
                <FloorSelector floorConfig={{
                    floors, searchParams,
                    setSearchParams, addFloorHandler,
                    deleteFloorHandler
                }}></FloorSelector>

                <br/>

                <hr/>
                <br/>
                {hasError && <p style={{color: "red", textAlign: "center"}}>{errorMessage}</p>}
                <div className={styles.templateCont}>
                    <SaveMap submitHandler={handleSaveClick}></SaveMap>
                </div>

                <div className={styles.hide}>
                    <RoomModal map={app} roomTypes={roomTypes}></RoomModal>
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
