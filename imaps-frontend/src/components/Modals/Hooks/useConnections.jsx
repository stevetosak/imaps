import {useState} from "react";

export default function useConnections(map,shapeInfo,setShapeInfo){
    const [connections,setConnections] = useState([])

    const addConnection = () => {
        if (!shapeInfo.selectedPin || connections.includes(shapeInfo.selectedPin)) return;

        setConnections((prevConn) => {
            const updatedConnections = [...prevConn, shapeInfo.selectedPin];


            setShapeInfo((prevShapeInfo) => ({
                ...prevShapeInfo,
                ["selectedPin"]: "",
                ["selectedPins"]: updatedConnections,
            }));

            console.log(shapeInfo.name,shapeInfo.selectedPin,"TEST")

            map.drawConnection(shapeInfo.name,shapeInfo.selectedPin);
            return updatedConnections;
        });
    };

    const removeConnection = (connToRemove) => {
        setConnections((prevConn) => {
            const updatedPins = prevConn.filter((pin) => pin !== connToRemove);
            setShapeInfo((prevFormData) => ({
                ...prevFormData,
                selectedPins: updatedPins,
            }));
            return updatedPins;
        });
        map.removeConnection(shapeInfo.name, connToRemove);
    };


    return {
        connectionState: {connections,setConnections},
        handlers: {addConnection,removeConnection}

    }
}