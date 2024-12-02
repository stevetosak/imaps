import {useState} from "react";
import triggerMapSave from "../../../scripts/util/triggerMapSave.js";

export default function useModalState2(map,formData,setFormData){
    const [isOpen,setIsOpen] = useState(false);
    const [shape,setShape] = useState(null);

    const toggleModal = () => {
        if (isOpen) {
            shape.info = formData;
            map.updateRoomNames();
            triggerMapSave();
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
        modalState: {isOpen,setIsOpen,shape,setShape},
        handlers: {toggleModal,updateModalData,saveDetails}
    };
}