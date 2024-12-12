import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import searchIcon from "../../assets/search_icon.png";
import routeIcon from "../../assets/route_icon.png";
import closeIcon from "../../assets/close_icon.png";
import styles from "./SearchBar.module.css";

function SearchBar({ map, handleDirectionsSubmit, setIsPanelOpen, setSelectedRoom, availableShapes,handleFloorChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [availableOptions, setAvailableOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [inputFieldType, setInputFieldType] = useState("");
  const dropdownRef = useRef(null);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  function searchRoom() {
    let foundRoom = availableShapes.find(sh => sh.info.name === from)
    console.log("map fnum",map.floorNum)
    if(foundRoom.floorNum !== map.floorNum){
      handleFloorChange(foundRoom.floorNum);
    }


    console.log("FOUND ROOM: " + foundRoom)
    map.highlightShape(from);
    setSelectedRoom(foundRoom);
    setIsPanelOpen(true);
  }

  const handleInputFocus = (field) => {
    if (availableOptions.length === 0 && map) {
      setAvailableOptions(
          availableShapes
              .filter((sh) => sh.className === "RenderedRoom")
              .map((shape) => shape.info.name)
      );
    }
    setDropdownVisible(true);
    setInputFieldType(field);
  };

  const handleInputChange = (setter) => (event) => {
    const value = event.target.value;
    setter(value);
    setDropdownVisible(true);

    const filtered = availableOptions.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleOptionClick = (option) => {
    if (inputFieldType === "from") {
      setFrom(option);
    } else if (inputFieldType === "to") {
      setTo(option);
    }
    setDropdownVisible(false);
  };

  const renderDropdown = () => {
    if (!dropdownVisible || filteredOptions.length === 0) return null;

    const position = dropdownRef.current?.getBoundingClientRect() || { top: 0, left: 0, width: 0 };

    return ReactDOM.createPortal(
        <ul
            className={styles.dropdown}
            style={{
              position: "absolute",
              top: position.top + position.height,
              left: position.left,
              width: position.width,
            }}
        >
          {filteredOptions.map((option, index) => (
              <li
                  key={index}
                  className={styles.dropdownItem}
                  onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
          ))}
        </ul>,
        document.body // Portal renders outside the parent hierarchy
    );
  };

  return (
      <div className={styles.wrapper}>
        {!isExpanded ? (
            <div className={styles.searchBar}>
              <input
                  type="search"
                  className={styles.inputField}
                  placeholder="Search location"
                  aria-label="Search"
                  ref={dropdownRef} // Attach the input to calculate dropdown position
                  onFocus={() => handleInputFocus("from")}
                  onChange={handleInputChange(setFrom)}
                  value={from}
              />
              {renderDropdown()}
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
                    ref={inputFieldType === "from" ? dropdownRef : null}
                />
                <input
                    type="text"
                    placeholder="To"
                    aria-label="To"
                    value={to}
                    onFocus={() => handleInputFocus("to")}
                    onChange={handleInputChange(setTo)}
                    className={styles.inputField}
                    ref={inputFieldType === "to" ? dropdownRef : null}
                />
                {renderDropdown()}
              </div>
              <div className={styles.buttons}>
                <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => handleDirectionsSubmit(from, to)}
                >
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
