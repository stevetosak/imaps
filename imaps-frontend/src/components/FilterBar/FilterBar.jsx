import React, { useState, useEffect } from "react";
import styles from "./FilterBar.module.css";

function FilterBar(props) {
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (props.map) {
      const types = props.map.getRoomTypes() || [];
      setRoomTypes(types);
    }
  }, [props.map]);

  const filterLocation = (category) => {
    console.log(`Filter locations by: ${category}`);
    setSelectedCategory(category);
  };

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

export default FilterBar;
