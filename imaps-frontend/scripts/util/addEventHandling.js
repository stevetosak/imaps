export const addEventHandling = (shape, map, action) => {
    shape.on(action, () => {
        const eventName = shape.eventName;
        if (eventName) {
            const data = {
                room: shape,
                map: map,
            };
            const event = new CustomEvent(eventName, { detail: data });
            window.dispatchEvent(event);
        }
    });
}