import Konva from "konva";
import MapShape from "./MapShape";
import { _registerNode } from 'konva/lib/Global';
export default class Entrance extends MapShape {
    constructor(mousePos, blockSize, layer, rotation,snap) {
      super(
        {
          x: mousePos.x,
          y: mousePos.y,
          width: blockSize,
          height: blockSize * 2,
          fill: "#0051ff",
          stroke: "grey",
          strokeWidth: 1,
          opacity: 0.7,
          name: "mapObj",
          draggable: true,
          rotation: rotation,
          zIndex: 1,
        },
        layer,
        blockSize,
        snap
      );
      this.type = "Entrance";
    }
  }

  Entrance.prototype.className = 'Entrance'
_registerNode(Entrance);

