import styles from "../EntranceModal/EntranceModal.module.css";

export default function ModalMainEntranceCheckbox ({formData,updateModalData}){
    return (
        <div className={styles.formGroupCheckbox}>
            <input
                type="checkbox"
                id="isMainEntrance"
                name="isMainEntrance"
                checked={formData.isMainEntrance}
                onChange={updateModalData}
            />
            <label htmlFor="isMainEntrance" style={{color: "white"}}>Main Entrance</label>
        </div>
    )
}