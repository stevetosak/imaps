import React from "react";
import styles from "./Maps.module.css";
import "react-tiles-dnd/esm/index.css";
import { TilesContainer } from "react-tiles-dnd";
import { Link } from "react-router-dom";
import card from "../../assets/card-map.png";

const tiles = [
  { text: "FINKI", cols: 1, rows: 1 },
  { text: "TMF", cols: 1, rows: 1 },
  { text: "HOSPITAL", cols: 1, rows: 1 },
  { text: "POLICE", cols: 1, rows: 1 },
  { text: "LIBRARY", cols: 1, rows: 1 },
  { text: "PENTAGON", cols: 1, rows: 1 },
  { text: "WHITE HOUSE", cols: 1, rows: 1 },
  { text: "HOME", cols: 1, rows: 1 },
  { text: "HOME", cols: 1, rows: 1 },
  { text: "HOME", cols: 1, rows: 1 },
  { text: "HOME", cols: 1, rows: 1 },
  { text: "HOME", cols: 1, rows: 1 },
  { text: "HOME", cols: 1, rows: 1 },
  { text: "HOME", cols: 1, rows: 1 },
  { text: "HOME", cols: 1, rows: 1 },
  { text: "HOME", cols: 1, rows: 1 },
  { text: "HOME", cols: 1, rows: 1 },
  { text: "HOME", cols: 1, rows: 1 },
  { text: "HOME", cols: 1, rows: 1 },
  { text: "HOME", cols: 1, rows: 1 },
  { text: "PRESPATEKS", cols: 1, rows: 1 },
];

const renderTile = ({ data, isDragging }) => (
  <div style={{ padding: "1rem", width: "100%" }}>
    <Link to="/Maps/FinkiMaps/View" className={styles.linkStyle}>
      <div
        className={`${styles.tile} ${isDragging ? styles.dragging : ""}`}
        style={{ width: "100%", height: "100%" }}
      >
        <img src={card} className={styles.imgStyle} alt="Map Thumbnail" />
        <div>
          {data.text} {isDragging ? "DRAGGING" : null}
        </div>
      </div>
    </Link>
  </div>
);

const tileSize = (tile) => ({
  colSpan: tile.cols,
  rowSpan: tile.rows,
});

export default function Maps() {
  return (
    <div className={styles.container}>
      <h1>Explore maps</h1>

      <TilesContainer
        data={tiles}
        renderTile={renderTile}
        tileSize={tileSize}
        forceTileWidth={150}
        forceTileHeight={150}
      />
    </div>
  );
}
