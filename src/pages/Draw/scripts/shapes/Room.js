import Konva from "konva";
import MapShape from "./MapShape";
export default class Room extends MapShape {
    constructor(mousePos,blockSize,layer,rotation,snap) {
      super(
        {
          x: mousePos.x,
          y: mousePos.y,
          width: blockSize * 8,
          height: blockSize * 4,
          fill: "#DDE0F8",
          stroke: "grey",
          strokeWidth: 1,
          name: "mapObj",
          rotation: rotation,
          draggable: true,
        },
        layer,
        blockSize,
        snap
      );
  
      this.type = "Room";
    }
  }