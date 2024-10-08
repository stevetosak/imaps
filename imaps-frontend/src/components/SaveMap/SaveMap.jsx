import { useState } from 'react';
import HttpService from '../../Net/HttpService';

const SaveMap = ({submitHandler}) => {
    const [name, setName] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        submitHandler(name);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Map Name: </label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Enter map name" 
                        required
                    />
                </div>
                <div>
                    <button type="submit">Save Map</button>
                </div>
            </form>
        </>
    );
}

export default SaveMap;
