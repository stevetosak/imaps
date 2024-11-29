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

export default function StairsModal({map,shapes}){
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
        setFormData(getInitialFormData(event,roomObj));
        setConnections(roomObj.info.selectedPins || []);
        setIsOpen(true);
        event.detail.map.updateConnections();

        console.log(roomObj.info.selectedPins, "Loaded pins on modal open");
    },"openStairsModalEvent")

    const getInitialFormData = (event, roomObj) => (
        {
        name: roomObj.info.name || "",
        description: roomObj.info.description || "", // todo
        selectedPins: roomObj.info.selectedPins || [],
        selectedPin: "",
        //availabel pins ustvari info obj e
        availablePins: [...event.detail.map.getConnections()] || []
    });


    return (

        <Modal isOpen={isOpen} toggleModal={toggleModal} title={"Enter Stair Details"}>
            <ModalNameField formData={formData} updateModalData={updateModalData} phtext={"Enter name of stairs"}/>
            <ModalSelectConnections2
                formData={formData}
                updateModalData={updateModalData}
                addPinToList={addConnection}
                shapes={shapes.filter(sh => sh.className === "Stairs")}
            />
            <ModalDisplayConnections connections={connections} removePinFromList={removeConnection}/>
            <ModalDescriptionField updateModalData={updateModalData} formData={formData}/>
            <ModalSaveButton saveDetails={saveDetails}/>
        </Modal>
    )
}