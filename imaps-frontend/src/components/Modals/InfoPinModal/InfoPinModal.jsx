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
import useModalState2 from "../Hooks/useModalState2.jsx";
import useConnections from "../Hooks/useConnections.jsx";
import {useModalEvent} from "../Hooks/useModalEvent.jsx";

export default function InfoPinModal({map}) {

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        selectedPin: "",
        availablePins: [],
        selectedPins: [],
    });



    const {
        modalState: {isOpen,setIsOpen,setShape},
        handlers: {toggleModal,updateModalData,saveDetails}
    } = useModalState2(map,formData,setFormData);

    const {
        connectionState: {connections,setConnections},
        handlers: {addConnection,removeConnection}
    } = useConnections(map,formData,setFormData)


    useModalEvent((event) => {
        const roomObj = event.detail.room;
        setShape(roomObj);
        setFormData( {
            name: roomObj.info.name || "",
            description: roomObj.info.description || "",
            selectedPins: roomObj.info.selectedPins || [],
            selectedPin: "",
            availablePins: event.detail.map.getConnections() || []
        });
        setConnections(roomObj.info.selectedPins || []);
        setIsOpen(true);
        event.detail.map.updateConnections(); // ova vo use connections

        console.log(roomObj.info.selectedPins, "Loaded pins on modal open");
    },"openPinModalEvent")


    return (
        <Modal isOpen={isOpen} toggleModal={toggleModal} title={"Enter Pin Details"}>
            <ModalNameField formData={formData} updateModalData={updateModalData}/>
            <ModalSelectConnections formData={formData} updateModalData={updateModalData} addPinToList={addConnection}/>
            <ModalDisplayConnections connections={connections} removePinFromList={removeConnection}/>
            <ModalDescriptionField updateModalData={updateModalData} formData={formData}/>
            <ModalSaveButton saveDetails={saveDetails}/>
        </Modal>

    );
}

InfoPinModal.propTypes = {
    map: PropTypes.instanceOf(MapBuilder),
};
