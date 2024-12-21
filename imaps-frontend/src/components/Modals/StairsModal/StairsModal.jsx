import React, {useState} from "react";
import useModalState from "../Hooks/useModalState.jsx";
import {useModalEvent} from "../Hooks/useModalEvent.jsx";
import useConnections from "../Hooks/useConnections.jsx";
import ModalNameField from "../Components/ModalNameField.jsx";

import ModalDisplayConnections from "../Components/ModalDisplayConnections.jsx";
import ModalDescriptionField from "../Components/ModalDescriptionField.jsx";
import ModalSaveButton from "../Components/ModalSaveButton.jsx";
import Modal from "../Components/Modal.jsx";
import ModalSelectConnections2 from "../Components/ModalSelectConnections2.jsx";
import ShapeRegistry from "../../../scripts/util/ShapeRegistry.js";
import ShapeQuery from "../../../scripts/util/ShapeQuery.js";

export default function StairsModal({map}){
    const {
        modalState: {isOpen,setIsOpen,setShape,shapeInfo,setShapeInfo},
        handlers: {toggleModal,updateModalData,saveDetails}
    } = useModalState(map);

    const {
        connectionState: {connections,setConnections},
        handlers: {addConnection,removeConnection}
    } = useConnections(map,shapeInfo,setShapeInfo)


    useModalEvent((event) => {
        const roomObj = event.detail.room;
        setShape(roomObj);
        setShapeInfo(roomObj.info);
        console.log("stairs connections shape info: " + roomObj.info.selectedPins)
        setConnections(roomObj.info.selectedPins || []);
        setIsOpen(true);
        console.log(roomObj.info.selectedPins, "Loaded pins on modal open");
        event.detail.map.detachKeyPressEventListeners();
    },"openStairsModalEvent")



    return (

        <Modal isOpen={isOpen} toggleModal={toggleModal} title={"Enter Stair Details"}>
            <ModalNameField shapeInfo={shapeInfo} updateModalData={updateModalData} phtext={"Enter name of stairs"}/>
            <ModalSelectConnections2
                shapeInfo={shapeInfo}
                updateModalData={updateModalData}
                addConnection={addConnection}
                availableShapes={ShapeQuery.findAllByType("Stairs")}
            />
            <ModalDisplayConnections connections={connections} removePinFromList={removeConnection}/>
            <ModalDescriptionField shapeInfo={shapeInfo} updateModalData={updateModalData}/>
            <ModalSaveButton saveDetails={saveDetails}/>
        </Modal>
    )
}