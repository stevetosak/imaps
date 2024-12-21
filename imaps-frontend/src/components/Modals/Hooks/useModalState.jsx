import {useState} from "react";
import triggerMapSave from "../../../scripts/util/triggerMapSave.js";

export default function useModalState(map) {
    const [isOpen, setIsOpen] = useState(false);
    const [shape, setShape] = useState(null);
    const [shapeInfo,setShapeInfo] = useState({});


    const toggleModal = () => {
        if (isOpen) {
            shape.setInfo(shapeInfo);
            map.updateRoomNames();
            triggerMapSave();
            console.log("SHAPE BEF CLOSE:",shape.info)
            map.attachKeyPressEventListeners();
        }
        setIsOpen(!isOpen);
    };

    const updateModalData = (e) => {
        const {name, value, type, checked} = e.target;
        setShapeInfo(prevShapeInfo => ({
                ...prevShapeInfo,
                [name]: type === "checkbox" ? checked : value
            }
        ))
        console.log("SHAPE INFO UPDATE",shape.info)
    };

    const saveDetails = () => {
        if (shape) {
            toggleModal();
        }
    };

    return {
        modalState: {isOpen, shapeInfo,setIsOpen, shape, setShape,setShapeInfo},
        handlers: {toggleModal, updateModalData, saveDetails}
    };
}