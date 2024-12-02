import { useState } from 'react';
import HttpService from '../../scripts/net/HttpService';
import styles from './SaveMap.module.css';
import triggerMapSave from "../../scripts/util/triggerMapSave.js";

const SaveMap = ({submitHandler}) => {
    const [name, setName] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // submitHandler();
        // const mapSaveEvent = new CustomEvent("mapsave",{});
        // window.dispatchEvent(mapSaveEvent)
        triggerMapSave();
    };

    return (
        <>
        <div className={styles.saveMapContainer}>
            <form onSubmit={handleSubmit} className={styles.saveMapForm}>
                <div>
                    <button type="submit" className={styles.saveMapButton}>Save Map</button>
                </div>
            </form>
            </div>
        </>
    );
}

export default SaveMap;
