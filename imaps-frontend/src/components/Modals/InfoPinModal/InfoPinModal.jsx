import React, {useState, useEffect} from "react";
import styles from "./InfoPinModal.module.css";
import PropTypes, {instanceOf} from "prop-types";
import {MapBuilder} from "../../../scripts/main/MapBuilder.js";
import ModalNameField from "../Components/ModalNameField.jsx";
import ModalSelectConnections from "../Components/ModalSelectConnections.jsx";
import ModalDisplayConnections from "../Components/ModalDisplayConnections.jsx";
import ModalDescriptionField from "../Components/ModalDescriptionField.jsx";
import ModalSaveButton from "../Components/ModalSaveButton.jsx";
import Modal from "../Components/Modal.jsx";
import useModalState from "../Hooks/useModalState.jsx";
import useConnections from "../Hooks/useConnections.jsx";
import {useModalEvent} from "../Hooks/useModalEvent.jsx";
import ModalSelectConnections2 from "../Components/ModalSelectConnections2.jsx";
import ShapeQuery from "../../../scripts/util/ShapeQuery.js";

export default function InfoPinModal({map}) {

    const {
        modalState: {isOpen,shapeInfo,shape,setIsOpen,setShape,setShapeInfo},
        handlers: {toggleModal,updateModalData,saveDetails}
    } = useModalState(map);

    const {
        connectionState: {connections,setConnections},
        handlers: {addConnection,removeConnection}
    } = useConnections(map,shapeInfo,setShapeInfo)


    useModalEvent((event) => {
        const shape = event.detail.room;
        setShape(shape);
        setShapeInfo({
            ...shape.info,
            selectedPin: ""
        })
        setConnections(shape.info.selectedPins || []);
        setIsOpen(true);

        console.log(shape.info.selectedPins, "Loaded pins on modal open");
    },"openPinModalEvent")


    return (
        <Modal isOpen={isOpen} toggleModal={toggleModal} title={"Enter Pin Details"}>
            <ModalNameField shapeInfo={shapeInfo} updateModalData={updateModalData}/>
            <ModalSelectConnections2
                shapeInfo={shapeInfo}
                availableShapes={ShapeQuery.findAllByTypeAndFloor(map?.floorNum,"Stairs","InfoPin","Entrance")}
                updateModalData={updateModalData}
                addConnection={addConnection}
            />
            <ModalDisplayConnections connections={connections} removePinFromList={removeConnection}/>
            <ModalDescriptionField shapeInfo={shapeInfo} updateModalData={updateModalData}/>
            <ModalSaveButton saveDetails={saveDetails}/>
        </Modal>

    );
}

InfoPinModal.propTypes = {
    map: PropTypes.instanceOf(MapBuilder),
};
