import Konva from "konva";
import MapShape from "./MapShape";
import { _registerNode } from 'konva/lib/Global';
export default class Wall extends MapShape {
    constructor(attrs){
        if(!attrs.fromLoad){
            attrs.height *= 8;
        }


      super(
        {
          x: attrs.position.x,
          y: attrs.position.y,
          width: attrs.width * attrs.scaleX,
          height: attrs.height * attrs.scaleY,
          fill: "#DDE0F8",
          stroke: "grey",
          strokeWidth: 1,
          name: "mapObj",
          draggable: true,
          rotation: attrs.rotation,
          zIndex: 0,
        },
        attrs.layer,
        attrs.blockSize,
        attrs.snap,
      );
      this.type = "Wall";
    }
  }

  Wall.prototype.className = 'Wall'
  _registerNode(Wall);