import styles from "../EntranceModal/EntranceModal.module.css";
import React, {useEffect} from "react";

export default function ModalDisplayConnections({connections,removePinFromList}){

    useEffect(() => {
        console.log("CONNNECTIONS: " + connections);
    }, []);

    return (
        <>
            <h3>Connections:</h3>
            <ul className={styles.pinList}>
                {connections.length > 0 ? (
                    connections.map((pin, index) => (
                        <li key={index} className={styles.pinItem}>
                            {pin}
                            <button onClick={() => removePinFromList(pin)} className={styles.removeButton}>
                                Remove
                            </button>
                        </li>
                    ))
                ) : (
                    <li>No connections added</li>
                )}
            </ul>
            <br/>
        </>
    )
}