import React, {useState, useEffect} from "react";
import styles from "./InfoPinModal.module.css";
import PropTypes from "prop-types";
import {MapBuilder} from "../../../scripts/main/MapBuilder.js";
import useModalState from "../Hooks/useModalState.jsx";
import ModalNameField from "../Components/ModalNameField.jsx";
import ModalSelectRoom from "../Components/ModalSelectRoom.jsx";
import ModalSelectConnections from "../Components/ModalSelectConnections.jsx";
import ModalDisplayConnections from "../Components/ModalDisplayConnections.jsx";
import ModalDescriptionField from "../Components/ModalDescriptionField.jsx";
import ModalSaveButton from "../Components/ModalSaveButton.jsx";
import Modal from "../Components/Modal.jsx";

export default function InfoPinModal({map}) {

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        selectedPin: "",
        availablePins: [],
        selectedPins: [],
    });

    const getInitialFormData = (event, roomObj, savedPins) => ({
        name: roomObj.info.name || "", // Room name
        description: roomObj.info.description || "",
        selectedPin: "",
        availablePins: event.detail.map.getConnections() || [],
        selectedPins: roomObj.info.selectedPins,
    })

    const {
        modalState: {isOpen, toggleModal, saveDetails, updateModalData},
        connectionsState: {connections, addPinToList, removePinFromList},
    } = useModalState(formData, setFormData, map, getInitialFormData, 'openPinModalEvent');



    return (
        <Modal isOpen={isOpen} toggleModal={toggleModal} title={"Enter Pin Details"}>
            <ModalNameField formData={formData} updateModalData={updateModalData}/>
            <ModalSelectConnections formData={formData} updateModalData={updateModalData} addPinToList={addPinToList}/>
            <ModalDisplayConnections connections={connections} removePinFromList={removePinFromList}/>
            <ModalDescriptionField updateModalData={updateModalData} formData={formData}/>
            <ModalSaveButton saveDetails={saveDetails}/>
        </Modal>

    );
}

InfoPinModal.propTypes = {
    map: PropTypes.objectOf(MapBuilder)
};
