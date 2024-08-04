import React from "react";
import styles from "./Maps.module.css";
import "react-tiles-dnd/esm/index.css";
import { TilesContainer } from "react-tiles-dnd";
import { Link } from "react-router-dom";

const tiles = [
  { text: "Tile 1", cols: 1, rows: 1 },
  { text: "Tile 2", cols: 1, rows: 1 },
  { text: "Tile 3", cols: 1, rows: 1 },
  { text: "Tile 4", cols: 1, rows: 1 },
  { text: "Tile 5", cols: 1, rows: 1 },
  { text: "Tile 6", cols: 1, rows: 1 },
  { text: "Tile 7", cols: 1, rows: 1 },
  { text: "Tile 8", cols: 1, rows: 1 },
  { text: "Tile 9", cols: 1, rows: 1 },
];

const renderTile = ({ data, isDragging }) => (
  <div style={{ padding: "1rem", width: "100%" }}>
    <Link to="/Maps/FinkiMaps">
      <div
        className={`${styles.tile} ${isDragging ? styles.dragging : ""}`}
        style={{ width: "100%", height: "100%" }}
      >
        {data.text} {isDragging ? "DRAGGING" : null}
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
      <h1>Fixed tile width, variable columns</h1>
      <p>Try to enlarge/reduce the screen, and the container will adapt</p>
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
