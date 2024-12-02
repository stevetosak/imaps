import { useState, useEffect } from "react";
import HttpService from "../../../scripts/net/HttpService.js";
import {MapBuilder} from "../../../scripts/main/MapBuilder.js";
import getAllShapes from "../../../scripts/util/getAllShapes.js";
import parseMapData from "../../../scripts/util/parseMapData.js";
import ShapeRegistry from "../../../scripts/util/ShapeRegistry.js";
import saveMap from "../../../components/SaveMap/SaveMap.jsx";
import triggerMapSave from "../../../scripts/util/triggerMapSave.js";



const useMapLoader = (mapName, username, searchParams, setSearchParams) => {
    const [floors, setFloors] = useState([]);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [app, setApp] = useState(null);
    const [shapes,setShapes] = useState([]);

    useEffect(() => {
        if (!searchParams.has("floor")) {
            setSearchParams({ floor: "0" });
        }
    }, [setSearchParams, searchParams]);

    useEffect(() => {
        const loadFloors = async () => {
            const httpService = new HttpService();
            try {
                const respFloors = await httpService.get(`/protected/my-maps/load?mapName=${mapName}&username=${username}`);
                console.log("Floors loaded:", respFloors);
                setFloors(respFloors);
                setMapLoaded(true);

                respFloors.forEach(flr => {
                    parseMapData(flr.mapData,() => true,false)
                })

            } catch (e) {
                console.error("Can't load map:", e.message);
            }
        };

        if (!mapLoaded) {
            loadFloors();

        }
    }, [mapName, username]);

    // floor change
    useEffect(() => {
        if (!mapLoaded || floors === undefined || floors.length === 0) return;

        const floorNum = parseInt(searchParams.get("floor"));
        const selectedFloor = floors.find((f) => f.num === floorNum);

        if (!selectedFloor) {
            console.error(`Floor ${floorNum} not found`);
            return;
        }

        console.log("Changing to floor:", selectedFloor);

        const appInstance = new MapBuilder("container", floorNum,mapName);
        appInstance.loadNewFloor(selectedFloor);
        setApp(appInstance);
        console.log("Fchange");
        triggerMapSave();

        }, [searchParams, mapLoaded]);


    const saveFloor = async () => {
        const payload = app.saveShapeDetails();
        const httpService = new HttpService("http://localhost:8080/api/protected", true);
        try {
            const responseFloor = await httpService.put(`/my-maps/save?username=${username}`, payload);
            console.log("FLOORS",floors.length)

            setFloors((prevFloors) =>
                prevFloors.map(floor => floor.num === responseFloor.num ? responseFloor : floor)
            )
            console.log(responseFloor, "resp in builder");
        } catch (err) {
            console.log("ERROR --> Could not Save map --->", err);
        }
    }


    useEffect(() => {
        if (app) {
            const handleSaveFloor = () => {
                console.log("mapsave event triggered");
                saveFloor();
            };

            window.addEventListener("mapsave", handleSaveFloor);
            return () => {
                window.removeEventListener("mapsave", handleSaveFloor);
            };
        }
    }, [app]); // Add event listener only when app is set


    useEffect(() => {
        return () => {
            if (app) {
                app.clearMap();
                app.stage.destroy();
            }
        };
    }, [app]);

    return { app, floors, saveFloor };
};

export default useMapLoader;
