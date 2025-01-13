import React, { useState } from 'react';
import styles from './PublishForm.module.css';

const PublishForm = ({ isAdmin = false, formData, onSubmit, onCancel, onApprove, onDeny }) => {
    const [state, setState] = useState(isAdmin ? 'viewing' : 'writing');
    const [form, setForm] = useState(
        formData || {
            id: -1,
            name: '',
            lastName: '',
            mapName: '',
            mapType: 'Other',
            googleMapsUrl: '',
        }
    );
    const [errors, setErrors] = useState({});
    const [denyReason, setDenyReason] = useState('');
    const [isDenying, setIsDenying] = useState(false);

    const mapTypeOptions = ['Hospital', 'Faculty', 'House', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
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
            onSubmit(form);
        }
    };

    const handleDeny = () => {
        if (!denyReason.trim()) {
            alert('Please provide a reason for denial.');
            return;
        }
        onDeny(form.id, form.mapName, denyReason);
        setIsDenying(false);
    };

    return (
        <>
            <div className={styles.modalOverlay}></div>
            <div className={styles.modal}>
                <div className={styles.modalContent}>
                    <h2>{state === 'writing' ? 'Publish Map' : 'View Map Details'}</h2>
                    {state === 'writing' ? (
                        <form>
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
                                {errors.googleMapsUrl && (
                                    <p className={styles.error}>{errors.googleMapsUrl}</p>
                                )}
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
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={onCancel}
                                >
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
                                <a
                                    href={form.googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {form.googleMapsUrl}
                                </a>
                            </p>
                            <p><strong>Type of Map:</strong> {form.mapType}</p>
                            <div className={styles.buttonGroup}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => {
                                        setIsDenying(false);
                                        onCancel();
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.approveButton}
                                    onClick={() => onApprove(form.id, form.mapName)}
                                >
                                    Approve
                                </button>
                                <button
                                    className={styles.denyButton}
                                    onClick={() => setIsDenying(true)}
                                >
                                    Deny
                                </button>
                            </div>
                            {isDenying && (
                                <div className={styles.denyReason}>
                                    <textarea className={styles.denyReasonTextArea}
                                        placeholder="Enter reason for denial..."
                                        value={denyReason}
                                        onChange={(e) => setDenyReason(e.target.value)}
                                    />
                                    <div className={styles.buttonGroup}>
                                        <button
                                            className={styles.denySubmitButton}
                                            onClick={handleDeny}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PublishForm;
