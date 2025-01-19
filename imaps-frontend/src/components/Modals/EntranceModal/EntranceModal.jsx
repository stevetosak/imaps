import React, {useState, useEffect} from "react";
import styles from "./EntranceModal.module.css";
import PropTypes from "prop-types";
import {MapBuilder} from "../../../scripts/main/MapBuilder.js";

import Modal from "../Components/Modal.jsx";
import ModalNameField from "../Components/ModalNameField.jsx";
import ModalSelectRoom from "../Components/ModalSelectRoom.jsx";
import ModalSelectConnections from "../Components/ModalSelectConnections.jsx";
import ModalDisplayConnections from "../Components/ModalDisplayConnections.jsx";
import ModalDescriptionField from "../Components/ModalDescriptionField.jsx";
import ModalSaveButton from "../Components/ModalSaveButton.jsx";
import ModalMainEntranceCheckbox from "../Components/ModalMainEntranceCheckbox.jsx";
import {useModalEvent} from "../Hooks/useModalEvent.jsx";
import useModalState from "../Hooks/useModalState.jsx";
import useConnections from "../Hooks/useConnections.jsx";
import ModalSelectConnections2 from "../Components/ModalSelectConnections2.jsx";
import ShapeQuery from "../../../scripts/util/ShapeQuery.js";

export default function EntranceModal({map}) {

    const {
        modalState: {isOpen,setIsOpen,shape,setShape,shapeInfo,setShapeInfo},
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
        const connections = shape.info.selectedPins || [];
        setConnections(connections);
        setIsOpen(true);
        event.detail.map.detachKeyPressEventListeners();
        console.log(connections, "Loaded pins on modal open");
    },"openEntranceModalEvent")



    return (
        <Modal isOpen={isOpen} toggleModal={toggleModal} title={"Enter Entrance Details"}>
            <ModalNameField shapeInfo={shapeInfo} updateModalData={updateModalData}/>
            <ModalSelectRoom shapeInfo={shapeInfo} availableRooms={ShapeQuery.findAllByTypeAndFloor(shape?.floorNum,"Room")} updateModalData={updateModalData}/>
            <ModalSelectConnections2
                availableShapes={ShapeQuery.findAllByTypeAndFloor(map?.floorNum,"Entrance","InfoPin")} // najubo ke e entrance samo so room da mozit
                addConnection={addConnection}
                updateModalData={updateModalData}
                shapeInfo={shapeInfo}
            />
            <ModalDisplayConnections connections={connections} removePinFromList={removeConnection}/>
            <ModalDescriptionField shapeInfo={shapeInfo} updateModalData={updateModalData}/>
            <ModalMainEntranceCheckbox shapeInfo={shapeInfo} updateModalData={updateModalData}></ModalMainEntranceCheckbox>
            <ModalSaveButton saveDetails={saveDetails}/>
        </Modal>
    );
}

EntranceModal.propTypes = {
    map: PropTypes.instanceOf(MapBuilder),
};
