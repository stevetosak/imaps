import {useEffect} from "react";

export default function useUpdateModalState(setShape,setFormData,getInitialFormData,setConnections,setIsOpen,eventName){
    useEffect(() => {
        const openModalHandler = (event) => {
            const roomObj = event.detail.room;
            setShape(roomObj);

            const savedPins = roomObj.info.selectedPins || [];
            setFormData(getInitialFormData(event,roomObj,savedPins));

            setConnections(savedPins);
            setIsOpen(true);
            event.detail.map.updateConnections(); // da probam dali mozit samo so map bez event

            console.log(savedPins, "Loaded pins on modal open");
        };

        window.addEventListener(eventName, openModalHandler);

        return () => {
            window.removeEventListener(eventName, openModalHandler);
        };
    }, [getInitialFormData, setConnections, setFormData, setIsOpen, setShape]);
}