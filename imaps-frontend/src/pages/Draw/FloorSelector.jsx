import styles from "./Draw.module.css";
import plus_icon from "../../assets/plus_icon.png";

export const FloorSelector = ({floorConfig}) => {

    const {floors,searchParams,addFloorHandler,setSearchParams,deleteFloorHandler} = floorConfig;

    return (
        <div className={styles.floorSection}>
            <div className={styles.floorList}>
                <label className={styles.floorLabel}>Available Floors:</label>
                <div className={styles.floorItems}>
                    {/* Add new positive floor above */}
                    <button
                        className={styles.addFloorButton}
                        onClick={() => {
                            const newFloor = Math.max(...floors.map((f) => f.num)) + 1;
                            addFloorHandler(newFloor);
                        }}
                    >
                        <img src={plus_icon} alt="Add Positive Floor" className={styles.icon}/>
                    </button>

                    {/* Display editable floors */}
                    {floors
                        .sort((a, b) => b.num - a.num)
                        .map((floor) => (
                            <div key={floor.num} className={styles.floorItemWrapper}>
                                <button
                                    onClick={() => setSearchParams({floor: floor.num}, {replace: true})}
                                    className={`${styles.floorItem} ${
                                        searchParams.get("floor") == floor.num ? styles.activeFloor : ""
                                    }`}
                                >
                                    Floor {floor.num}
                                </button>
                                <button
                                    className={styles.deleteFloorButton}
                                    onClick={() => deleteFloorHandler(floor.num)}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}

                    {/* Add new negative floor below */}
                    <button
                        className={styles.addFloorButton}
                        onClick={() => {
                            const newFloor = Math.min(...floors.map((f) => f.num)) - 1;
                            addFloorHandler(newFloor);
                        }}
                    >
                        <img src={plus_icon} alt="Add Negative Floor" className={styles.icon}/>
                    </button>
                </div>
            </div>
        </div>
    )
}