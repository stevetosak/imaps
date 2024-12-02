import React, {useState, useEffect} from "react";
import useModalState from "../Hooks/useModalState.jsx";
import ModalNameField from "../Components/ModalNameField.jsx";
import ModalDescriptionField from "../Components/ModalDescriptionField.jsx";
import ModalSaveButton from "../Components/ModalSaveButton.jsx";
import Modal from "../Components/Modal.jsx";
import ModalRoomTypes from "../Components/ModalRoomTypes.jsx";
import useModalState2 from "../Hooks/useModalState2.jsx";
import useConnections from "../Hooks/useConnections.jsx";
import {useModalEvent} from "../Hooks/useModalEvent.jsx";

export default function RoomModal({map}) {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        description: "",
    });

    const [roomTypes, setRoomTypes] = useState([]);


    const {
        modalState: {isOpen,setIsOpen,setShape},
        handlers: {toggleModal,updateModalData,saveDetails}
    } = useModalState2(map,formData,setFormData);


    useModalEvent((event) => {
        const shape = event.detail.room;
        setShape(shape);
        setFormData({
            name: shape.info.name || "",
            type: shape.info.type || "",
            description: shape.info.description || "",
        })

        setIsOpen(true);

    },"openRoomModalEvent")


    useEffect(() => {
        setRoomTypes(map?.roomTypes)
        console.log("VLEZE EF")

    }, [map]);


    return (
        <Modal isOpen={isOpen} toggleModal={toggleModal} title={"Enter Room Details"}>
            <ModalNameField formData={formData} updateModalData={updateModalData}/>
            <ModalRoomTypes updateModalData={updateModalData} formData={formData} roomTypes={roomTypes}/>
            <ModalDescriptionField updateModalData={updateModalData} formData={formData}/>
            <ModalSaveButton saveDetails={saveDetails}/>
        </Modal>
    );
}
