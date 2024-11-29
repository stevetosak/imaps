import {json, useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {MapDisplay} from "../../scripts/main/MapDisplay.js";
import styles from "./MapView.module.css";
import SideBar from "../../components/SideBar/SideBar.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import FilterBar from "../../components/FilterBar/FilterBar.jsx";
import Profile from "../../components/Profile/Profile.jsx";
import MapControls from "../../components/MapControls/MapControls.jsx";
import {AuthContext} from "../../components/AuthContext/AuthContext.jsx";
import RoomInfoPanel from "../../components/RoomInfoPanel/RoomInfoPanel.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import floorIcon from "../../assets/floor_icon.png";
import Logo from "../../components/Logo/Logo.jsx";
import netconfig from "../../scripts/net/netconfig.js";
import parseMapData from "../../scripts/util/parseMapData.js";

const MapView = ({isPrivate}) => {
    const {mapName} = useParams();
    const {username} = useContext(AuthContext);

    const [mapLoaded, setMapLoaded] = useState(false);
    const [app, setApp] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [floors, setFloors] = useState([]); // ova trebit da sa objekti
    const navigate = useNavigate();
    const [shapes,setShapes] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();


    useEffect(() => {
        if (!searchParams.has("floor")) {
            setSearchParams({floor: "0"}); // Ensure searchParams is initialized
        }
    }, [setSearchParams, searchParams]);


    useEffect(() => {
        const appInstance = new MapDisplay("map");

        const floorNum = parseInt(searchParams.get("floor"));

        const load = async () => {
            const httpService = new HttpService();

            try {
                const endpoint = isPrivate
                    ? netconfig.endpoints.protect.load
                    : netconfig.endpoints.public.load;

                const params = isPrivate ?
                    `?mapName=${mapName}&floorNum=${floorNum}&username=${username}` :
                    `?mapName=${mapName}&floorNum=${floorNum}`;

                if (isPrivate) {
                    httpService.setAuthenticated(); // auth header
                }

                return httpService.get(`${endpoint}${params}`);
            } catch (e) {
                throw new Error("Can't load map: " + e.message);
            }
        };

        load()
            .then(respFloors => {
                let tlFloor = respFloors.filter(f => f.num === floorNum)[0];

                let parsedShapes = [];

                respFloors.forEach(flr => {
                    const parsed = parseMapData(flr.mapData,(shape => shape.className !== "InfoPin"))
                    parsedShapes = [...parsedShapes,...parsed];
                })

                setShapes(parsedShapes)

                parsedShapes.forEach(shape => {
                    console.info("PARSED Shapes: " + shape.info.name)
                })


                setFloors(respFloors);
                appInstance.loadMapN(tlFloor?.mapData)
                setApp(appInstance);
                setMapLoaded(true);
            })
            .catch(reason => {
                console.log("ERROR LOADING MAP VIEW: " + reason)
            });


    }, [searchParams, isPrivate, mapName, setSearchParams]);

    //nova load, ne vo MapDisplay

    //loso
    useEffect(() => {
        const openRoomInfoPanel = (e) => {
            setSelectedRoom(e.detail.room);
            setIsPanelOpen(true)

        }
        window.addEventListener("openRoomInfoPanel", openRoomInfoPanel);

        return () => window.removeEventListener("openRoomInfoPanel", openRoomInfoPanel);
    })

    const handleDirectionsSubmit = (fromSearch = null, toSearch = null) => {
        if (fromSearch === null && toSearch === null) {
            return;
        }

        if (fromSearch === null || fromSearch === "") {
            fromSearch = app.getMainEntrance().info.name;
        }
        const url = new URL("http://localhost:8080/api/public/navigate");
        url.searchParams.append("from", fromSearch.trim());
        url.searchParams.append("to", toSearch.trim());


        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Success:", data);
                const points = data.map((item) => item.coordinates);
                app.drawRoute(points);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

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

    /**
     *
     */
    const handleFloorChange = (floorNum) => {
        setSearchParams({floor: floorNum});
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
        selectedRoom.unHighlight()
    };


    return (
        <div id="main" className={styles.main}>
            <div id="map" className={styles.mapContainer}></div>

            <RoomInfoPanel isOpen={isPanelOpen} onClose={closePanel} floor={searchParams.get("floor")}
                           room={selectedRoom} handleDirectionsSubmit={handleDirectionsSubmit}/>
            <div className={styles.toolbar}>
                {/* <h1>{username}</h1> */}
                {/* <SideBar /> */}
                <div className={styles.left}>
                    <Logo></Logo>
                    <h1>{mapName}</h1>
                    {mapLoaded && app && (
                        <>
                            <SearchBar map={app} handleDirectionsSubmit={handleDirectionsSubmit}
                                       isPanelOpen={isPanelOpen} setSelectedRoom={setSelectedRoom} availableShapes={shapes}/>
                            <FilterBar map={app}/>
                        </>
                    )}
                </div>
                <Profile/>
            </div>
            <div className={styles.mapControlsContainer}>
                {/*<MapControls*/}
                {/*    floors={floors}*/}
                {/*    onFloorChange={handleFloorChange}*/}
                {/*/>*/}

                <div className={styles.floorSelector}>
                    <img src={floorIcon} alt="Floor Icon" className={styles.floorIcon}/>
                    <select
                        value={searchParams.get("floor")}
                        onChange={(e) => handleFloorChange(parseInt(e.target.value, 10))}
                        className={styles.floorDropdown}
                    >
                        {floors?.map((floor) => (
                            <option key={floor.num} value={floor.num}>
                                {floor.num}F
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default MapView;
