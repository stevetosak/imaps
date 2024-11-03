import Konva from "konva";
import MapShape from "./MapShape";
import { _registerNode } from 'konva/lib/Global';
export default class Wall extends MapShape {
    constructor(mousePos, blockSize, layer, rotation,snap,scaleX = 1, scaleY = 1,fromLoad){
      super(
        {
          x: mousePos.x,
          y: mousePos.y,
          width: blockSize * scaleX,
          height: blockSize * 8 * scaleY,
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
      console.log("SC",scaleX,scaleY)
      this.type = "Wall";
    }
  }

  Wall.prototype.className = 'Wall'
  _registerNode(Wall);