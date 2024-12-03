import styles from "../EntranceModal/EntranceModal.module.css";

export default function ModalDescriptionField({shapeInfo,updateModalData}){
    return (
        <div className={styles.formGroup}>
            <label htmlFor="description">Description:</label>
            <textarea
                id="description"
                name="description"
                value={shapeInfo.description}
                onChange={updateModalData}
                rows="3"
            />
        </div>
    )
}