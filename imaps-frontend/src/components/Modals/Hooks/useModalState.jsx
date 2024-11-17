import {useEffect, useState} from "react";

export default function useModalState(formData,setFormData,map,getInitialFormData,eventName = null){
    const [isOpen, setIsOpen] = useState(false);
    const [shape, setShape] = useState(null);
    const [connections, setConnections] = useState([]);

    useEffect(() => {
        const openModalHandler = (event) => {
            const roomObj = event.detail.room;
            setShape(roomObj);

            const savedPins = roomObj.info.selectedPins || [];
            setFormData(getInitialFormData(event,roomObj,savedPins));

            setConnections(savedPins);
            setIsOpen(true);
            event.detail.map.updateConnections(); // ova mozda da sa trgnit

            console.log(savedPins, "Loaded pins on modal open");
        };

        if(eventName == null) return;

        window.addEventListener(eventName, openModalHandler);

        return () => {
            window.removeEventListener(eventName, openModalHandler);
        };
    }, []);

    const addPinToList = () => {
        if (!formData.selectedPin || connections.includes(formData.selectedPin)) return;

        setConnections((prevPins) => {
            const updatedPins = [...prevPins, formData.selectedPin];

            setFormData((prevFormData) => ({
                ...prevFormData,
                selectedPin: "",
                selectedPins: updatedPins,
            }));

            console.log(formData.name,formData.selectedPin,"TEST")

            map.drawConnection(formData.name,formData.selectedPin);
            return updatedPins;
        });
    };

    const removePinFromList = (pinToRemove) => {
        setConnections((prevPins) => {
            const updatedPins = prevPins.filter((pin) => pin !== pinToRemove);
            setFormData((prevFormData) => ({
                ...prevFormData,
                selectedPins: updatedPins,
            }));
            return updatedPins;
        });
        map.removeConnection(formData.name, pinToRemove);
    };

    const toggleModal = () => {
        if (isOpen) {
            const oldShapeName = shape.info.name;
            shape.info = formData;
            map.updateRoomNames();
            console.log("Se vikna");
        }
        setIsOpen(!isOpen);
    };

    const updateModalData = (e) => {

        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));

        shape.info.name = formData.name;
    };

    const saveDetails = () => {
        if (shape) {
            shape.info = formData;
            toggleModal();
        }
    };


    return {
        modalState: { isOpen, setIsOpen, toggleModal,saveDetails,updateModalData},
        connectionsState: { connections,setConnections, addPinToList, removePinFromList},
        updateState: {shape, setShape}
    };



}