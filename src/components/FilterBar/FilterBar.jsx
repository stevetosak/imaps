import React from "react";
import styles from "./FilterBar.module.css";

function FilterBar() {
  const filterLocation = (category) => {
    console.log(`Filter locations by: ${category}`);
    // filtering logic
  };

  return (
    <div className={styles.wrapper}>
      <div>
        <button className={styles.buttonValue} onClick={() => filterLocation("all")}>
          All
        </button>
        <button className={styles.buttonValue} onClick={() => filterLocation("Classrooms")}>
          Classrooms
        </button>
        <button className={styles.buttonValue} onClick={() => filterLocation("Administrative")}>
          Administrative
        </button>
        <button className={styles.buttonValue} onClick={() => filterLocation("Labs")}>
          Labs
        </button>
        <button className={styles.buttonValue} onClick={() => filterLocation("Restrooms")}>
          Restrooms
        </button>
        <button className={styles.buttonValue} onClick={() => filterLocation("Cafeteria")}>
          Cafeteria
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
