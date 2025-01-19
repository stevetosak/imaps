import React, {useState, useEffect} from "react";
import ModalNameField from "../Components/ModalNameField.jsx";
import ModalDescriptionField from "../Components/ModalDescriptionField.jsx";
import ModalSaveButton from "../Components/ModalSaveButton.jsx";
import Modal from "../Components/Modal.jsx";
import ModalRoomTypes from "../Components/ModalRoomTypes.jsx";
import useModalState from "../Hooks/useModalState.jsx";
import {useModalEvent} from "../Hooks/useModalEvent.jsx";
import ModalUploadRoomImage from "../Components/ModalUploadRoomImage.jsx";

export default function RoomModal({map,roomTypes}) {
    const {
        modalState: {isOpen,setIsOpen,setShape,shapeInfo,setShapeInfo},
        handlers: {toggleModal,updateModalData,saveDetails}
    } = useModalState(map);


    useModalEvent((event) => {
        const shape = event.detail.room;
        setShape(shape);
        setShapeInfo(shape.info);
        setIsOpen(true);
        event.detail.map.detachKeyPressEventListeners();

    },"openRoomModalEvent")



    return (
        <Modal isOpen={isOpen} toggleModal={toggleModal} title={"Enter Room Details"}>
            <ModalNameField shapeInfo={shapeInfo} updateModalData={updateModalData}/>
            <ModalRoomTypes updateModalData={updateModalData} shapeInfo={shapeInfo} roomTypes={roomTypes}/>
            <ModalDescriptionField shapeInfo={shapeInfo} updateModalData={updateModalData}/>
            <ModalUploadRoomImage></ModalUploadRoomImage>
            <ModalSaveButton saveDetails={saveDetails}/>
        </Modal>
    );
}
