import React, { useState, useEffect } from "react";
import searchIcon from "../../assets/search_icon.png";
import routeIcon from "../../assets/route_icon.png";
import closeIcon from "../../assets/close_icon.png";
import styles from "./SearchBar.module.css";

function SearchBar({map}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [availableOptions, setAvailableOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [inputFieldType, setInputFieldType] = useState(""); // Track which input field is being typed in

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  function searchRoom() {
    map.search();
  }

  const handleDirectionsSubmit = () => {
    let fromubav = from;
    let toubav = to;

    if(fromubav === null || fromubav === ""){
      fromubav = map.getMainEntrance().info.name;
    }
    setFrom(fromubav.trim());
    setTo(toubav.trim())
    const url = new URL("http://localhost:8080/api/public/navigate");
    url.searchParams.append("from", fromubav);
    url.searchParams.append("to", toubav);

    console.log(`From: ${from}, To: ${to}`);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        const points = data.map((item) => item.coordinates);
        map.drawRoute(points);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Load available rooms and entrances when the input field is focused
  const handleInputFocus = (field) => {
    if (availableOptions.length === 0 && map) {
      const rooms = map.getRooms() || [];
      const entrances = map.getEntrances() || [];
      setAvailableOptions([...rooms, ...entrances]);
    }
    setDropdownVisible(true);
    setInputFieldType(field); // Set the current input field being typed into
  };

  // Filter available options based on user input
  const handleInputChange = (setter) => (event) => {
    const value = event.target.value;
    setter(value);
    setDropdownVisible(true);

    const filtered = availableOptions.filter((option) => option.toLowerCase().includes(value.toLowerCase()));
    setFilteredOptions(filtered);
  };

  // Handle option selection
  const handleOptionClick = (option) => {
    if (inputFieldType === "from") {
      setFrom(option);
    } else if (inputFieldType === "to") {
      setTo(option);
    }
    setDropdownVisible(false);
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
            onFocus={() => handleInputFocus("from")}
            onChange={handleInputChange(setFrom)}
            value={from}
          />
          {dropdownVisible && filteredOptions.length > 0 && inputFieldType === "from" && (
            <ul className={styles.dropdown}>
              {filteredOptions.map((option, index) => (
                <li key={index} className={styles.dropdownItem} onClick={() => handleOptionClick(option)}>
                  {option}
                </li>
              ))}
            </ul>
          )}
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
              onFocus={() => handleInputFocus("from")}
              onChange={handleInputChange(setFrom)}
              className={styles.inputField}
            />
            {dropdownVisible && filteredOptions.length > 0 && inputFieldType === "from" && (
              <ul className={styles.dropdown}>
                {filteredOptions.map((option, index) => (
                  <li key={index} className={styles.dropdownItem} onClick={() => handleOptionClick(option)}>
                    {option}
                  </li>
                ))}
              </ul>
            )}
            <input
              type="text"
              placeholder="To"
              aria-label="To"
              value={to}
              onFocus={() => handleInputFocus("to")}
              onChange={handleInputChange(setTo)}
              className={styles.inputField}
            />
            {dropdownVisible && filteredOptions.length > 0 && inputFieldType === "to" && (
              <ul className={styles.dropdown}>
                {filteredOptions.map((option, index) => (
                  <li key={index} className={styles.dropdownItem} onClick={() => handleOptionClick(option)}>
                    {option}
                  </li>
                ))}
              </ul>
            )}
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
