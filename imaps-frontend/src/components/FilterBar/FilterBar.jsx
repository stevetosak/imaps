import React, { useState, useEffect, useCallback } from "react";
import styles from "./FilterBar.module.css";

export default function FilterBar({roomTypes,map}) {
  const [selectedCategory, setSelectedCategory] = useState("all");



  const filterLocation = useCallback((category) => {
    map.setFilter(category)
    setSelectedCategory(category);
  },[])

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollableContainer}>
        <button
          className={`${styles.buttonValue} ${selectedCategory === "all" ? styles.active : ""}`}
          onClick={() => filterLocation("all")}
        >
          All
        </button>

        {roomTypes?.map((roomType, index) => (
          <button
            key={index}
            className={`${styles.buttonValue} ${selectedCategory === roomType.name ? styles.active : ""}`}
            onClick={() => filterLocation(roomType.name)}
          >
            {roomType.name}
          </button>
        ))}
      </div>
    </div>
  );
}

