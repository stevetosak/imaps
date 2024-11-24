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

    const {
        modalState: {isOpen, toggleModal, saveDetails, updateModalData},
        connectionsState: {connections, addPinToList, removePinFromList},
    } = useModalState(formData, setFormData, map, getInitialFormData, "openEntranceModalEvent");

    return (
        <Modal isOpen={isOpen} toggleModal={toggleModal} title={"Enter Entrance Details"}>
            <ModalNameField formData={formData} updateModalData={updateModalData}/>
            <ModalSelectRoom formData={formData} updateModalData={updateModalData}/>
            <ModalSelectConnections
                formData={formData}
                updateModalData={updateModalData}
                addPinToList={addPinToList}
            />
            <ModalDisplayConnections connections={connections} removePinFromList={removePinFromList}/>
            <ModalDescriptionField updateModalData={updateModalData} formData={formData}/>
            <ModalMainEntranceCheckbox formData={formData} updateModalData={updateModalData}></ModalMainEntranceCheckbox>
            <ModalSaveButton saveDetails={saveDetails}/>
        </Modal>
    );
}

EntranceModal.propTypes = {
    map: PropTypes.instanceOf(MapBuilder),
};
