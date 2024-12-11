import React, {useEffect, useState} from 'react';
import styles from './PublishForm.module.css';
import log from "eslint-plugin-react/lib/util/log.js";

const PublishForm = ({ isAdmin = false, formData, onSubmit, onCancel,onApprove,onDeny,mapName}) => {
    const [state, setState] = useState(isAdmin ? 'viewing' : 'writing');
    const [form, setForm] = useState( formData || {
        id: -1,
        name: '',
        lastName: '',
        mapName: '',
        mapType: 'Other',
        googleMapsUrl: '',
    });
    const [errors, setErrors] = useState({});

    const mapTypeOptions = ['Hospital', 'Faculty', 'House', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };



    const validateForm = () => {
        const newErrors = {};
        // if (!form.mapName.trim()) newErrors.mapName = 'Map Name is required.';
        if (!form.name.trim()) newErrors.name = 'Name is required.';
        if (!form.lastName.trim()) newErrors.lastName = 'Last Name is required.';
        if (!form.googleMapsUrl.trim()) newErrors.googleMapsUrl = 'Google Maps URL is required.';
        return newErrors;
    };

    const handleSubmit = () => {
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        if (state === 'writing') {
            console.log("FORM DATA" + JSON.stringify(form))
            onSubmit(form);
            //setState('viewing');
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>{state === 'writing' ? 'Publish Map' : 'View Map Details'}</h2>
                {state === 'writing' ? (
                    <form>
                        <div>
                            <input
                                type="hidden"
                                name="mapName"
                                value={form.mapName}
                                onChange={handleChange}
                            />
                            {errors.mapName && <p className={styles.error}>{errors.mapName}</p>}
                        </div>
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                            />
                            {errors.name && <p className={styles.error}>{errors.name}</p>}
                        </div>
                        <div>
                            <label>Last Name:</label>
                            <input
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                            />
                            {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
                        </div>
                        <div>
                            <label>Google Maps URL:</label>
                            <input
                                type="url"
                                name="googleMapsUrl"
                                value={form.googleMapsUrl}
                                onChange={handleChange}
                            />
                            {errors.googleMapsUrl && <p className={styles.error}>{errors.googleMapsUrl}</p>}
                        </div>
                        <div>
                            <label>Type of Map:</label>
                            <select
                                name="mapType"
                                value={form.mapType}
                                onChange={handleChange}
                            >
                                {mapTypeOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.buttonGroup}>
                            <button type="button" onClick={handleSubmit}>
                                Submit
                            </button>
                            <button type="button" className={styles.cancelButton} onClick={onCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <p><strong>Map Name:</strong> {form.mapName}</p>
                        <p><strong>Name:</strong> {form.name}</p>
                        <p><strong>Last Name:</strong> {form.lastName}</p>
                        <p>
                            <strong>Google Maps URL:</strong>{' '}
                            <a href={form.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                                {form.googleMapsUrl}
                            </a>
                        </p>
                        <p><strong>Type of Map:</strong> {form.mapType}</p>
                        <button type="button" onClick={() => setState('writing')}>
                            Edit
                        </button>
                        <button type="button" className={styles.cancelButton} onClick={onCancel}>
                            Cancel
                        </button>
                            <button className={styles.approveButton} onClick={(e) => {
                                e.stopPropagation();
                                onApprove(form.id);
                            }}>
                                Approve
                            </button>
                            <button className={styles.denyButton} onClick={(e) => {
                                e.stopPropagation();
                                //const reason = e.target.closest('div').previousSibling.value;
                                onDeny(form.id, "Deka taka sakam");
                            }}>
                                Deny
                            </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublishForm;
