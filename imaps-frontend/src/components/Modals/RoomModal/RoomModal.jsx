import React, { useState, useEffect } from "react";
import styles from "./RoomModal.module.css";
import { Ring } from "konva/lib/shapes/Ring";
import useModalState from "../Hooks/useModalState.jsx";
import ModalNameField from "../Components/ModalNameField.jsx";
import ModalSelectConnections from "../Components/ModalSelectConnections.jsx";
import ModalDisplayConnections from "../Components/ModalDisplayConnections.jsx";
import ModalDescriptionField from "../Components/ModalDescriptionField.jsx";
import ModalSaveButton from "../Components/ModalSaveButton.jsx";
import Modal from "../Components/Modal.jsx";
import ModalRoomTypes from "../Components/ModalRoomTypes.jsx";
import useUpdateModalState from "../Hooks/useUpdateModalState.jsx";

export default function RoomModal({map}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
  });

  const [roomTypes, setRoomTypes] = useState([]);

  const getInitialFormData = (event,roomObj,savedPins)  => ({
    name: roomObj.info.name || "",
    type: roomObj.info.type || "",
    description: roomObj.info.description || "",
  })

  const {
    modalState: {isOpen, toggleModal, saveDetails, updateModalData},
  } = useModalState(formData, setFormData, map,getInitialFormData,"openRoomModalEvent");
  return (
      <Modal isOpen={isOpen} toggleModal={toggleModal} title={"Enter Room Details"}>
        <ModalNameField formData={formData} updateModalData={updateModalData}/>
        <ModalRoomTypes updateModalData={updateModalData} formData={formData} roomTypes={roomTypes}/>
        <ModalDescriptionField updateModalData={updateModalData} formData={formData}/>
        <ModalSaveButton saveDetails={saveDetails}/>
      </Modal>
  );
}
