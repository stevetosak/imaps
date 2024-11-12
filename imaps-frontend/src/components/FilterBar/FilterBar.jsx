import React, { useState, useEffect, useCallback } from "react";
import styles from "./FilterBar.module.css";

export default function FilterBar(props) {
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (props.map) {
      const types = props.map.getRoomTypes() || [];
      setRoomTypes(types);
    }
  }, [props.map]);

  const filterLocation = useCallback((category) => {
    props.map.setFilter(category)
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

        {roomTypes.map((type, index) => (
          <button
            key={index}
            className={`${styles.buttonValue} ${selectedCategory === type ? styles.active : ""}`}
            onClick={() => filterLocation(type)}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}

