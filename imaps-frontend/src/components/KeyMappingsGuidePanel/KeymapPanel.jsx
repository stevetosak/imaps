import { useState } from "react";
import styles from './KeymapPanel.module.css'; // Import the CSS module

const keyMappings = [
    { key: 'W', info: 'Move Up' },
    { key: 'A', info: 'Move Left' },
    { key: 'S', info: 'Move Down' },
    { key: 'D', info: 'Move Right' },
    { key: 'Space', info: 'Jump / Shoot' },
    { key: 'E', info: 'Interact' },
    { key: 'Q', info: 'Switch Weapon' }
];

const KeyboardPanel = () => {
    const [hoveredKey, setHoveredKey] = useState(null);

    return (
        <div className={styles.keyboardPanel}>
            {keyMappings.map((keyItem, index) => (
                <button
                    key={index}
                    className={styles.keyButton}
                    onMouseEnter={() => setHoveredKey(keyItem.info)}
                    onMouseLeave={() => setHoveredKey(null)}
                >
                    {keyItem.key}
                </button>
            ))}

            {hoveredKey && (
                <div className={styles.keyInfo}>
                    {hoveredKey}
                </div>
            )}
        </div>
    );
};

export default KeyboardPanel;
