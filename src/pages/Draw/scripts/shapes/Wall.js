import Konva from "konva";
import MapShape from "./MapShape";
export default class Wall extends MapShape {
    constructor(mousePos, blockSize, layer, rotation,snap) {
      super(
        {
          x: mousePos.x,
          y: mousePos.y,
          width: blockSize,
          height: blockSize * 8,
          fill: "#DDE0F8",
          stroke: "grey",
          strokeWidth: 1,
          name: "mapObj",
          draggable: true,
          rotation: rotation,
          zIndex: 0,
        },
        layer,
        blockSize,
        snap,
      );
  
      this.type = "Wall";
    }
  }