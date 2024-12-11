import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {useContext, useEffect, useRef, useState} from "react";
import {MapDisplay} from "../../scripts/main/MapDisplay.js";
import styles from "./MapView.module.css";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import FilterBar from "../../components/FilterBar/FilterBar.jsx";
import Profile from "../../components/Profile/Profile.jsx";
import RoomInfoPanel from "../../components/RoomInfoPanel/RoomInfoPanel.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import floorIcon from "../../assets/floor_icon.png";
import Logo from "../../components/Logo/Logo.jsx";
import config from "../../scripts/net/netconfig.js";
import parseMapData from "../../scripts/util/parseMapData.js";
import ShapeRegistry from "../../scripts/util/ShapeRegistry.js";
import {useAppContext} from "../../components/AppContext/AppContext.jsx";

const MapView = ({isPrivate}) => {
    const {mapName} = useParams();
    const {username} = useAppContext();

    const [mapLoaded, setMapLoaded] = useState(false);
    const [app, setApp] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [floors, setFloors] = useState([]); // ova trebit da sa objekti
    const navigate = useNavigate();
    const [shapes, setShapes] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [mainEntrance,setMainEntrance] = useState({});

    const defaultNavObj = {
        enabled: false,
        nextFloor: 0,
        nodes: [],
        offset: 0
    }

    const [navNext, setNavNext] = useState(defaultNavObj)
    const [roomTypes,setRoomTypes] = useState([]);

    useEffect(() => {
        const loadRoomTypes = async () => {
            const httpService = new HttpService();
            let roomTypes;
            if(isPrivate){
                roomTypes = await httpService.get(`${config.room_types.display(true)}?mapName=${mapName}&username=${username}`)
            } else {
                roomTypes = await httpService.get(`${config.room_types.display(false)}?mapName=${mapName}`)
            }

            console.log("loaded ROOM TYPES: " + roomTypes)
            setRoomTypes(roomTypes);
        }
        loadRoomTypes().then(resp => {
            console.log("LOADED ROOM TYPES")
        })
    }, []);


    useEffect(() => {
        if (!searchParams.has("floor")) {
            setSearchParams({floor: "0"},{replace: true});
        }
    }, [setSearchParams, searchParams]);


    useEffect(() => {


        const floorNum = parseInt(searchParams.get("floor") || 0);
        const appInstance = new MapDisplay("map", floorNum);

        const load = async () => {
            const httpService = new HttpService();

            try {
                let url;
                if(isPrivate){
                    httpService.setAuthenticated();
                    url = `${config.view_maps.load(true)}?mapName=${mapName}&username=${username}`
                } else {
                    url = `${config.view_maps.load(false)}?mapName=${mapName}`
                }

                return httpService.get(url);
            } catch (e) {
                throw new Error("Can't load map: " + e.message);
            }
        };

        load()
            .then(respFloors => {
                let tlFloor = respFloors.filter(f => f.num === floorNum)[0];

                let parsedShapes = [];

                respFloors.forEach(flr => {
                    console.log("FLR", flr)
                    const parsed = parseMapData(flr.mapData, (shape => shape.className !== "InfoPin"), true)
                    parsedShapes = [...parsedShapes, ...parsed];
                })

                setShapes(parsedShapes)

                parsedShapes.forEach(shape => {
                    console.info("PARSED Shapes: " + shape.info.name)
                })

                const mainEntrance = parsedShapes.find(shape => shape.info.isMainEntrance);
                setMainEntrance(mainEntrance)

                console.log("MAIN ENTRANCE: " + mainEntrance)


                setFloors(respFloors);

                appInstance.loadMapN(tlFloor?.mapData)
                setApp(appInstance);
                setMapLoaded(true);
            })
            .catch(reason => {
                console.log("ERROR LOADING MAP VIEW: " + reason)
            });


    }, []);

    //nova load, ne vo MapDisplay

    //loso
    useEffect(() => {
        const openRoomInfoPanel = (e) => {
            setSelectedRoom(e.detail.room);
            setIsPanelOpen(true)
            console.log("SHAPES REG", ShapeRegistry.getShapes().length)

        }
        window.addEventListener("openRoomInfoPanel", openRoomInfoPanel);

        return () => window.removeEventListener("openRoomInfoPanel", openRoomInfoPanel);
    },[])

    const handleDirectionsSubmit = (fromSearch = null, toSearch = null) => {

        if (fromSearch === null && toSearch === null) {
            return;
        }

        if (fromSearch === null || fromSearch === "") {
            fromSearch = mainEntrance.info.name;
        }

        let shapeFrom = shapes.find(sh => sh.info.name === fromSearch)

        console.log("SGAPE FLOORNUM: " + shapeFrom.floorNum,"APP FLOOR NUM " + app.floorNum)

        if (shapeFrom.floorNum != searchParams.get("floor")) {
            handleFloorChange(shapeFrom.floorNum);
        }

       const httpService = new HttpService();

        if(isPrivate){
            httpService.setAuthenticated();
        }


        const fromEncoded = encodeURIComponent(fromSearch).trimEnd()
        const toEncoded = encodeURIComponent(toSearch).trimEnd()

       httpService.get(`${config.view_maps.navigate}?from=${fromEncoded}&to=${toEncoded}`).then(path => {
           app.drawRouteNEW(path);
       }).catch(reason => {
           console.log("err",reason)
       })
    };

    const multiFloorNavigate = () => {
        if (navNext && app) {
            console.log("NAVNEXT F: " + navNext.nextFloor)
            const f = navNext.nextFloor;
            handleFloorChange(f)
            setTimeout(() => {
                app.drawRouteNEW(navNext.nodes, navNext.offset)
            }, 50)
            setNavNext(defaultNavObj)

        }
    }


    useEffect(() => {

        const handleNavigate = (event) => {
            console.log("SHAPES NAV", shapes)

            setNavNext({
                enabled: true,
                nextFloor: event.detail.changeFloorTo,
                nodes: event.detail.nodes,
                offset: event.detail.offset
            })

            console.log("ROUTE LAYER", app.routeLayer);
        }

        window.addEventListener("navigate", handleNavigate)
        return () => {
            window.removeEventListener("navigate", handleNavigate);
        };

    }, [app, mapLoaded]);

    const handleFloorChange = (floorNum) => {
        setSearchParams({floor: floorNum},{replace:true});
        const chFloor = floors.find(floor => floor.num === floorNum)

        console.log("FLOOR NUM:", floorNum, "CHFLOOR:",chFloor)
        app.clearRoute()
        app.loadMapN(chFloor.mapData)


        console.log(`Floor changed to: ${floorNum}`);
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        selectedRoom.unHighlight()
    };


    return (
        <div id="main" className={styles.main}>
            {navNext.enabled && (
                <div className={styles.nextButtonContainer}>
                    <button onClick={multiFloorNavigate} className={styles.nextButton}>
                        NEXT FLOOR
                    </button>
                </div>
            )}

            <div id="map" className={styles.mapContainer}></div>

            <RoomInfoPanel isOpen={isPanelOpen} onClose={closePanel} floor={searchParams.get("floor")}
                           room={selectedRoom} handleDirectionsSubmit={handleDirectionsSubmit}/>
            <div className={styles.toolbar}>
                <div className={styles.toolbarContainer}>
                    <div className={styles.logoContainer}>
                        <Logo position="relative"/>
                    </div>
                    <h1 className={styles.mapTitle}>{mapName}</h1>
                    {mapLoaded && app && (
                        <div className={styles.searchFilterContainer}>
                            <SearchBar
                                map={app}
                                handleDirectionsSubmit={handleDirectionsSubmit}
                                isPanelOpen={isPanelOpen}
                                setSelectedRoom={setSelectedRoom}
                                availableShapes={shapes}
                            />
                            <FilterBar map={app} roomTypes={roomTypes}/>
                        </div>
                    )}
                    <div className={styles.profileContainer}>
                        <Profile position="relative"/>
                    </div>
                </div>
            </div>

            <div className={styles.floorSelectorContainer}>
                <div className={styles.floorSelector}>
                    <img src={floorIcon} alt="Floor Icon" className={styles.floorIcon}/>
                    <select
                        value={searchParams.get("floor")}
                        onChange={(e) => handleFloorChange(parseInt(e.target.value, 10))}
                        className={styles.floorDropdown}
                    >
                        {floors?.map((floor) => (
                            <option key={floor.num} value={floor.num}>
                                Floor {floor.num}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

        </div>
    );
};

export default MapView;
