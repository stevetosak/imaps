import {useEffect} from "react";

export function useModalEvent(openModalHandler,eventName){
    useEffect(() => {

        if(eventName == null) return;

        window.addEventListener(eventName, openModalHandler);

        return () => {
            window.removeEventListener(eventName, openModalHandler);
        };
    }, []);
}