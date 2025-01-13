import React, { useState } from "react";
import styles from "./Report.module.css";
import report_icon from "../../assets/report_icon.png";
import {useAppContext} from "../AppContext/AppContext.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import config from "../../scripts/net/netconfig.js";

const Report = ({mapName}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");
    const {username} = useAppContext();

    const handleSubmit = async () => {
        if (!topic.trim() || !description.trim()) {
            alert("Please fill in both fields.");
            return;
        }

        let httpService = new HttpService(true);
        let payload = {
            username: username,
            mapName: mapName,
            subject: topic,
            content: description,
        }

        let response = await httpService.post(config.view_maps.add_report, payload);

        setTopic("")
        setDescription("")
        setIsModalOpen(false)
    }


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
