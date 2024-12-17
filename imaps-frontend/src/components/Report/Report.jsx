import React, { useState } from "react";
import styles from "./Report.module.css";
import report_icon from "../../assets/report_icon.png";

const Report = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        if (topic.trim() && description.trim()) {
            console.log("Sending email to map creator", { topic, description });
            alert("Report submitted successfully!");
            setIsModalOpen(false);
            setTopic("");
            setDescription("");
        } else {
            alert("Please fill in both fields.");
        }
    };

    const handleOutsideClick = (e) => {
        if (e.target.classList.contains(styles.modalBackground)) {
            setIsModalOpen(false);
        }
    };

    return (
        <div>
            <button className={styles.reportButton} onClick={() => setIsModalOpen(true)}>
                <img src={report_icon} alt="Report Icon" className={styles.reportIcon} />
            </button>

            {isModalOpen && (
                <div className={styles.modalBackground} onClick={handleOutsideClick}>
                    <div className={styles.modalContent}>
                        <h2>Report Issue</h2>
                        <input
                            type="text"
                            placeholder="Topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className={styles.inputField}
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles.textareaField}
                        ></textarea>
                        <div className={styles.buttonGroup}>
                            <button onClick={handleSubmit} className={styles.submitButton}>
                                Submit
                            </button>
                            <button onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Report;
