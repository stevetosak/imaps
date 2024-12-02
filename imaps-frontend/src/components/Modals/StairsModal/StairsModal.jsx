import React, {useState} from "react";
import useModalState2 from "../Hooks/useModalState2.jsx";
import {useModalEvent} from "../Hooks/useModalEvent.jsx";
import useConnections from "../Hooks/useConnections.jsx";
import ModalNameField from "../Components/ModalNameField.jsx";
import ModalSelectRoom from "../Components/ModalSelectRoom.jsx";
import ModalSelectConnections from "../Components/ModalSelectConnections.jsx";
import ModalDisplayConnections from "../Components/ModalDisplayConnections.jsx";
import ModalDescriptionField from "../Components/ModalDescriptionField.jsx";
import ModalMainEntranceCheckbox from "../Components/ModalMainEntranceCheckbox.jsx";
import ModalSaveButton from "../Components/ModalSaveButton.jsx";
import Modal from "../Components/Modal.jsx";
import ShapeQuery from "../../../scripts/util/ShapeQuery.js";
import ModalSelectConnections2 from "../Components/ModalSelectConnections2.jsx";
import ShapeRegistry from "../../../scripts/util/ShapeRegistry.js";

export default function StairsModal({map}){
    const [formData,setFormData] = useState({
        name: "",
        description: "",
        selectedPins: [],
        availablePins:[],
        selectedPin: "",

    })

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
    },"openStairsModalEvent")



    return (

        <Modal isOpen={isOpen} toggleModal={toggleModal} title={"Enter Stair Details"}>
            <ModalNameField formData={formData} updateModalData={updateModalData} phtext={"Enter name of stairs"}/>
            <ModalSelectConnections2
                formData={formData}
                updateModalData={updateModalData}
                addPinToList={addConnection}
                shapes={ShapeRegistry.getShapes().filter(sh => sh.className === "Stairs")}
            />
            <ModalDisplayConnections connections={connections} removePinFromList={removeConnection}/>
            <ModalDescriptionField updateModalData={updateModalData} formData={formData}/>
            <ModalSaveButton saveDetails={saveDetails}/>
        </Modal>
    )
}