import {useEffect} from "react";
import HttpService from "../../../scripts/net/HttpService.js";
import log from "eslint-plugin-react/lib/util/log.js";
import config from "../../../scripts/net/netconfig.js";

export const useRoomTypesLoader = (setRoomTypes,mapName,username) => {
    useEffect(() => {
            const loadRoomTypes = async () => {
                const httpService = new HttpService();
                httpService.setAuthenticated();
                const roomTypes = await httpService.get(`${config.room_types.display(true)}?mapName=${mapName}&username=${username}`)
                console.log("loaded ROOM TYPES: " + roomTypes)
                setRoomTypes(roomTypes);
            }
            loadRoomTypes()
                .then(resp => {
                    console.log("LOADED ROOM TYPES")
                })

    }, []);

    const addRoomType = async (roomTypeName) => {
        const httpService = new HttpService();
        httpService.setAuthenticated();
        await httpService.post(`${config.room_types.add}?roomTypeName=${roomTypeName}&username=${username}&mapName=${mapName}`)

        setRoomTypes((prevRoomTypes) => [...prevRoomTypes,{name:roomTypeName}]);
    }

    return {addRoomType}
}