export const dispatchCustomEvent = (eventName,data) => {
    let event = new CustomEvent(eventName,{
        detail : data
    })
    window.dispatchEvent(event)
}