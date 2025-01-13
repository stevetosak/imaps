import React, { useEffect, useState } from "react";
import styles from "./ListReports.module.css";
import HttpService from "../../scripts/net/HttpService.js";
import config from "../../scripts/net/netconfig.js";

const ListReports = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const loadReports = async () => {
            try {
                const httpService = new HttpService(true);
                httpService.setAuthenticated();

                const respReports = await httpService.get(config.admin.load_reports);

                const sortedReports = respReports.sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                );

                setReports(sortedReports);
            } catch (error) {
                console.error("Error loading reports:", error);
            }
        };
        loadReports();
    }, []);

    const handleButtonClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <button className={styles.openButton} onClick={handleButtonClick}>
                View Reports
            </button>

            {isModalOpen && (
                <div className={styles.modalBackground} onClick={handleCloseModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.heading}>Reports</div>
                        <div className={styles.cardContainer}>
                            {reports.length > 0 ? (
                                reports.map((report, index) => (
                                    <div key={index} className={styles.card}>
                                        <div className={styles.cardTitle}>{report.subject}</div>
                                        <div className={styles.cardContent}>{report.content}</div>
                                        <small className={styles.cardFooter}>
                                            User: {report.username} | Map: {report.mapName} |{" "}
                                            {new Date(report.date).toLocaleDateString()}
                                        </small>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.noReports}>No reports available</p>
                            )}
                        </div>
                        <button className={styles.closeButton} onClick={handleCloseModal}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListReports;
