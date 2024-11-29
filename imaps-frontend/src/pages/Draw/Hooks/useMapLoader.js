import { useState, useEffect } from "react";
import HttpService from "../../../scripts/net/HttpService.js";
import {MapBuilder} from "../../../scripts/main/MapBuilder.js";
import getAllShapes from "../../../scripts/util/getAllShapes.js";



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

                const parsedShapes = getAllShapes(respFloors,false,(shape => shape.className !== "Wall"))
                setShapes(parsedShapes)

            } catch (e) {
                console.error("Can't load map:", e.message);
            }
        };

        if (!mapLoaded) {
            loadFloors();
        }
    }, [mapLoaded, mapName, username]);

    useEffect(() => {
        // Handle floor change
        if (!mapLoaded || floors.length === 0) return;

        const floorNum = parseInt(searchParams.get("floor"));
        const selectedFloor = floors.find((f) => f.num === floorNum);

        if (!selectedFloor) {
            console.error(`Floor ${floorNum} not found`);
            return;
        }

        console.log("Changing to floor:", selectedFloor);

        const appInstance = new MapBuilder("container", floorNum);
        appInstance.loadNewFloor(selectedFloor);

        setApp(appInstance);
    }, [searchParams, floors, mapLoaded]);

    useEffect(() => {
        return () => {
            if (app) {
                app.clearMap();
                app.stage.destroy();
            }
        };
    }, [app]);

    return { app, floors, shapes };
};

export default useMapLoader;
