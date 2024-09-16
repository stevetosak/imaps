import React, { useState } from "react";
import searchIcon from "../../assets/search_icon.png";
import routeIcon from "../../assets/route_icon.png";
import closeIcon from "../../assets/close_icon.png";
import navIcon from "../../assets/step_into_icon.png";
import styles from "./SearchBar.module.css";

function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const initial = (
    <div className={` ${styles.customSearch}`}>
      <input
        type="search"
        className="form-control rounded"
        placeholder="Search"
        aria-label="Search"
        aria-describedby="search-addon"
      />
      <button type="button" className={`btn btn-outline-primary`} data-mdb-ripple-init>
        <img src={searchIcon} alt="Search Icon" />
      </button>
      <button
        type="button"
        className={`btn btn-outline-primary`}
        data-mdb-ripple-init
        onClick={toggleExpanded}
      >
        <img src={routeIcon} alt="Route Icon" />
      </button>
    </div>
  );

  const expanded = (
    <div>
      <div className={styles.expandedSection}>
        <div className={styles.left}>
          <img src={navIcon} alt="" />
        </div>
        <div className={styles.right}>
          <div className={styles.customSearch}>
            <input type="text" className="form-control rounded" placeholder="From" aria-label="From" />
            <button
              type="button"
              className={`btn btn-outline-primary`}
              data-mdb-ripple-init
              onClick={toggleExpanded}
            >
              <img src={closeIcon} alt="Close Icon" />
            </button>
          </div>
          <div className={styles.customSearch}>
            <input type="text" className="form-control rounded" placeholder="To" aria-label="To" />
            <button
              type="button"
              className={`btn btn-outline-primary ${styles.hide}`}
              data-mdb-ripple-init
              onClick={toggleExpanded}
            >
              <img src={closeIcon} alt="Close Icon" />
            </button>
          </div>
        </div>
        <hr />
      </div>
      <button type="button" className={`btn btn-outline-primary ${styles.customButton}`} data-mdb-ripple-init>
        <img src={searchIcon} alt="Search Icon" />
      </button>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <div className={isExpanded ? styles.expanded : styles.collapsed}>{isExpanded ? expanded : initial}</div>
    </div>
  );
}

export default SearchBar;