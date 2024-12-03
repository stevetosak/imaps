let canSave = true;
const mapSaveEvent = new CustomEvent("mapsave",{});
const setCanSave = (value) => {
    canSave = value;
}
/**
 * Triggers a save event for the floor you are currently on with a debounce time of 3s;
 * @example triggerMapSave() - will save the floor once, and after 3s again.
 */
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