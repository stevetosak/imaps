import React, { useState } from "react";
import searchIcon from "../../assets/search_icon.png";
import routeIcon from "../../assets/route_icon.png";
import closeIcon from "../../assets/close_icon.png";
import styles from "./SearchBar.module.css";

function SearchBar(props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Toggle dropdown for directions
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  function searchRoom(){
    props.map.search();

  }

  // Handle submission of directions
  const handleDirectionsSubmit = () => {
    console.log(`From: ${from}, To: ${to}`);
    const url = new URL('http://localhost:8080/api/public/navigate');
    url.searchParams.append('from', from);
    url.searchParams.append('to', to);

    fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the JSON from the response
            })
            .then(data => {
                console.log('Success:', data);
                const points = data.map(item => item.coordinates);
                props.map.drawRoute(points);
            })
            .catch(error => {
                console.error('Error:', error);
            });
  };

  return (
    <div className={styles.wrapper}>
      {/* Regular search bar */}
      {!isExpanded ? (
        <div className={styles.searchBar}>
          <input
            type="search"
            className={styles.inputField}
            placeholder="Search location"
            aria-label="Search"
          />
          <div className={styles.buttons}>
            <button type="button" className={styles.iconButton} onClick={searchRoom}>
              <img src={searchIcon} alt="Search Icon" />
            </button>
            <button type="button" className={styles.iconButton} onClick={toggleExpanded}>
              <img src={routeIcon} alt="Route Icon" />
            </button>
          </div>
        </div>
      ) : (
        /* Expanded view for directions */
        <div className={styles.directionsContainer}>
          <div className={styles.directionsInputs}>
            <input
              type="text"
              placeholder="From"
              aria-label="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={styles.inputField}
            />
            <input
              type="text"
              placeholder="To"
              aria-label="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={styles.inputField}
            />
          </div>
          <div className={styles.buttons}>
            <button type="button" className={styles.iconButton} onClick={handleDirectionsSubmit}>
              <img src={searchIcon} alt="Submit Directions" />
            </button>
            <button type="button" className={styles.iconButton} onClick={toggleExpanded}>
              <img src={closeIcon} alt="Close Icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
