import {useState} from "react";

export default function useConnections(map,formData,setFormData){
    const [connections,setConnections] = useState([])

    const addConnection = () => {
        if (!formData.selectedPin || connections.includes(formData.selectedPin)) return;

        setConnections((prevConn) => {
            const updatedConnections = [...prevConn, formData.selectedPin];

            setFormData((prevFormData) => ({
                ...prevFormData,
                selectedPin: "",
                selectedPins: updatedConnections,
            }));

            console.log(formData.name,formData.selectedPin,"TEST")

            map.drawConnection(formData.name,formData.selectedPin);
            return updatedConnections;
        });
    };

    const removeConnection = (connToRemove) => {
        setConnections((prevConn) => {
            const updatedPins = prevConn.filter((pin) => pin !== connToRemove);
            setFormData((prevFormData) => ({
                ...prevFormData,
                selectedPins: updatedPins,
            }));
            return updatedPins;
        });
        map.removeConnection(formData.name, connToRemove);
    };


    return {
        connectionState: {connections,setConnections},
        handlers: {addConnection,removeConnection}

    }
}