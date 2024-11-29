import React, {useState, useEffect} from "react";
import styles from "./EntranceModal.module.css";
import PropTypes from "prop-types";
import {MapBuilder} from "../../../scripts/main/MapBuilder.js";
import useModalState from "../Hooks/useModalState.jsx";

import Modal from "../Components/Modal.jsx";
import ModalNameField from "../Components/ModalNameField.jsx";
import ModalSelectRoom from "../Components/ModalSelectRoom.jsx";
import ModalSelectConnections from "../Components/ModalSelectConnections.jsx";
import ModalDisplayConnections from "../Components/ModalDisplayConnections.jsx";
import ModalDescriptionField from "../Components/ModalDescriptionField.jsx";
import ModalSaveButton from "../Components/ModalSaveButton.jsx";
import ModalMainEntranceCheckbox from "../Components/ModalMainEntranceCheckbox.jsx";
import {useModalEvent} from "../Hooks/useModalEvent.jsx";
import useModalState2 from "../Hooks/useModalState2.jsx";
import useConnections from "../Hooks/useConnections.jsx";

export default function EntranceModal({map}) {
    const [formData, setFormData] = useState({
        // ova si sejt posebno vo sekoja komponenta
        name: "",
        connectedRoom: "",
        description: "",
        availableRooms: [],
        availablePins: [],
        selectedPins: [],
        isMainEntrance: false,
        selectedPin: "",
    });



    const {
        modalState: {isOpen,setIsOpen,shape,setShape},
        handlers: {toggleModal,updateModalData,saveDetails}
    } = useModalState2(map,formData,setFormData);

    const {
        connectionState: {connections,setConnections},
        handlers: {addConnection,removeConnection}
    } = useConnections(map,formData,setFormData)


    useModalEvent((event) => {
        const roomObj = event.detail.room;
        setShape(roomObj);
        const savedPins = roomObj.info.selectedPins || [];
        setFormData(getInitialFormData(event,roomObj,savedPins));
        setConnections(savedPins);
        setIsOpen(true);
        event.detail.map.updateConnections();

        console.log(savedPins, "Loaded pins on modal open");
    },"openEntranceModalEvent")

    const getInitialFormData = (event, roomObj, savedPins) => ({
        name: roomObj.info.name || "",
        connectedRoom: roomObj.info.connectedRoom || "",
        description: roomObj.info.description || "",
        availablePins: event.detail.map.getConnections() || [],
        availableRooms: event.detail.map.getRooms() || [],
        isMainEntrance: roomObj.info.isMainEntrance || false,
        selectedPin: "",
        selectedPins: savedPins,
    });

    // const {
    //     modalState: {isOpen, toggleModal, saveDetails, updateModalData},
    //     connectionsState: {connections, addPinToList, removePinFromList},
    // } = useModalState(formData, setFormData, map, getInitialFormData, "openEntranceModalEvent");


    return (
        <Modal isOpen={isOpen} toggleModal={toggleModal} title={"Enter Entrance Details"}>
            <ModalNameField formData={formData} updateModalData={updateModalData}/>
            <ModalSelectRoom formData={formData} updateModalData={updateModalData}/>
            <ModalSelectConnections
                formData={formData}
                updateModalData={updateModalData}
                addPinToList={addConnection}
            />
            <ModalDisplayConnections connections={connections} removePinFromList={removeConnection}/>
            <ModalDescriptionField updateModalData={updateModalData} formData={formData}/>
            <ModalMainEntranceCheckbox formData={formData} updateModalData={updateModalData}></ModalMainEntranceCheckbox>
            <ModalSaveButton saveDetails={saveDetails}/>
        </Modal>
    );
}

EntranceModal.propTypes = {
    map: PropTypes.instanceOf(MapBuilder),
};
