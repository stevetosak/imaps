const triggerNavigate = (nodes,idx,changeFloorTo,shape) => {
    const event = new CustomEvent("navigate",{
        detail: {
            nodes: nodes,
            offset: idx,
            changeFloorTo: changeFloorTo,
            shape:shape
        }
    })

    window.dispatchEvent(event);
}

export default triggerNavigate;