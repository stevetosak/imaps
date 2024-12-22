import React, { useState, useEffect, useCallback } from "react";
import styles from "./FilterMaps.module.css";

export default function FilterMaps({mapTypes,setFilter}) {
  const [selectedCategory, setSelectedCategory] = useState("all");



  const mapFilter = useCallback((category) => {
    setFilter(category)
    setSelectedCategory(category);
  },[])

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollableContainer}>
        <button
          className={`${styles.buttonValue} ${selectedCategory === "all" ? styles.active : ""}`}
          onClick={() => mapFilter("all")}
        >
          All
        </button>

        {mapTypes?.map((mapType, index) => (
          <button
            key={index}
            className={`${styles.buttonValue} ${selectedCategory === mapType ? styles.active : ""}`}
            onClick={() => mapFilter(mapType)}
          >
            {mapType}
          </button>
        ))}
      </div>
    </div>
  );
}

