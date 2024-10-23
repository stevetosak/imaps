import styles from "./DeleteConfirmationModal.module.css";

export default function DeleteConfirmationModal({ isOpen, onClose, onDelete, maps }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Select a Map to Delete</h2>
        <ul className={styles.mapList}>
          {maps.map((map) => (
            <li key={map.mapName} className={styles.mapItem}>
              {map.mapName}
              <button onClick={() => onDelete(map.mapName)} className={styles.deleteButton}>
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.modalActions}>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
