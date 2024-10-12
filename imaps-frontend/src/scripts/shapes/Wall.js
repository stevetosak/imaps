import Konva from "konva";
import MapShape from "./MapShape";
import { _registerNode } from 'konva/lib/Global';
export default class Wall extends MapShape {
    constructor(mousePos, blockSize, layer, rotation,snap, draggable = true) {
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
          draggable: draggable,
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

  Wall.prototype.className = 'Wall'
  _registerNode(Wall);