import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import searchIcon from "../../assets/search_icon.png";
import routeIcon from "../../assets/route_icon.png";
import closeIcon from "../../assets/close_icon.png";
import styles from "./SearchBar.module.css";

function SearchBar({
                     map,
                     handleDirectionsSubmit,
                     setIsPanelOpen,
                     setSelectedRoom,
                     availableShapes,
                     handleFloorChange,
                   }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [availableOptions, setAvailableOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [inputFieldType, setInputFieldType] = useState("");

  const wrapperRef = useRef(null);
  const dropdownContainerRef = useRef(null);
  const activeInputRef = useRef(null); // Track the currently focused input field

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handleClickOutside = (event) => {
    if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target)
    ) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchRoom = () => {
    const foundRoom = availableShapes.find((sh) => sh.info.name === from);
    if (foundRoom && foundRoom.floorNum !== map.floorNum) {
      handleFloorChange(foundRoom.floorNum);
    }
    map.highlightShape(from);
    setSelectedRoom(foundRoom);
    setIsPanelOpen(true);
  };

  const handleInputFocus = (field, inputRef) => {
    if (availableOptions.length === 0 && map) {
      setAvailableOptions(
          availableShapes
              .filter((sh) => sh.className === "RenderedRoom")
              .map((shape) => shape.info.name)
      );
    }
    setInputFieldType(field);
    setDropdownVisible(true);
    activeInputRef.current = inputRef; // Set the active input ref
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

    const position = activeInputRef.current?.getBoundingClientRect() || {
      top: 0,
      left: 0,
      width: 0,
    };

    return ReactDOM.createPortal(
        <ul
            ref={dropdownContainerRef}
            className={styles.dropdown}
            style={{
              position: "absolute",
              top: position.top + position.height + window.scrollY,
              left: position.left + window.scrollX,
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
        document.body
    );
  };

  return (
      <div className={styles.wrapper} ref={wrapperRef}>
        {!isExpanded ? (
            <div className={styles.searchBar}>
              <input
                  type="search"
                  className={styles.inputField}
                  placeholder="Search location"
                  aria-label="Search"
                  onFocus={(e) => handleInputFocus("from", e.target)}
                  onChange={handleInputChange(setFrom)}
                  value={from}
              />
              {renderDropdown()}
              <div className={styles.buttons}>
                <button
                    type="button"
                    className={styles.iconButton}
                    onClick={searchRoom}
                >
                  <img src={searchIcon} alt="Search Icon" />
                </button>
                <button
                    type="button"
                    className={styles.iconButton}
                    onClick={toggleExpanded}
                >
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
                    onFocus={(e) => handleInputFocus("from", e.target)}
                    onChange={handleInputChange(setFrom)}
                    className={styles.inputField}
                />
                <input
                    type="text"
                    placeholder="To"
                    aria-label="To"
                    value={to}
                    onFocus={(e) => handleInputFocus("to", e.target)}
                    onChange={handleInputChange(setTo)}
                    className={styles.inputField}
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
                <button
                    type="button"
                    className={styles.iconButton}
                    onClick={toggleExpanded}
                >
                  <img src={closeIcon} alt="Close Icon" />
                </button>
              </div>
            </div>
        )}
      </div>
  );
}

export default SearchBar;
