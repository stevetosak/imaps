let canSave = true;
const mapSaveEvent = new CustomEvent("mapsave",{});
const setCanSave = (value) => {
    canSave = value;
}

const triggerMapSave = () => {
    if(!canSave) return;

    window.dispatchEvent(mapSaveEvent)
    setCanSave(false);
    setTimeout(() => {
        setCanSave(true);
        window.dispatchEvent(mapSaveEvent)
    },3000)
}

export default triggerMapSave;