import { useState } from 'react';
import HttpService from '../../scripts/net/HttpService';
import styles from './SaveMap.module.css';

const SaveMap = ({submitHandler}) => {
    const [name, setName] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        submitHandler(name);
    };

    return (
        <>
        <div className={styles.saveMapContainer}>
            <form onSubmit={handleSubmit} className={styles.saveMapForm}>
                <div>
                    <label htmlFor="name">Map Name: </label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Enter map name" 
                        required
                        className={styles.saveMapInput}
                    />
                </div>
                <div>
                    <button type="submit" className={styles.saveMapButton}>Save Map</button>
                </div>
            </form>
            </div>
        </>
    );
}

export default SaveMap;
