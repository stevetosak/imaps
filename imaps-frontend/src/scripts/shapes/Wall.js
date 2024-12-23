import Konva from "konva";
import MapShape from "../base/MapShape.js";
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
          fill: "#d3d3d3",
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

        this.floorNum = attrs.floorNum;
    }

    loadInfo(attrs) {
        this.floorNum = attrs.floor_num;
    }

    saveShapeDetails() {
        this.setAttr("floor_num",this.floorNum)
    }
}

  Wall.prototype.className = 'Wall'
  _registerNode(Wall);