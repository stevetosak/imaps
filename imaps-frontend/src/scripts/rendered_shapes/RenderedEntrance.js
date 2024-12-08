import RenderedMapShape from "../base/RenderedMapShape.js";
import {_registerNode} from "konva/lib/Global";
import RenderedRoom from "./RenderedRoom.js";

export default class RenderedEntrance extends RenderedMapShape {
  constructor(attrs, scaleX, scaleY) {
    super({
      x: attrs.x,
      y: attrs.y,
      width: attrs.width * scaleX,
      height: attrs.height * scaleY,
      fill: "#7fef83",
      stroke: "black",
      strokeWidth: 1,
      draggable: false,
      rotation: attrs.rotation,
      cornerRadius: 3,
      zIndex: 0,
    });

    this.info.name = attrs.obj_name;
    this.info.description = attrs.description;
    this.info.isMainEntrance = attrs.is_main_entrance;

    this.floorNum = attrs.floor_num

    this.class = "Entrance";

    console.log("ATTRS VIEW:  " + attrs)

    this.on("mouseenter", () => {
      this.stroke("purple");
    });
    this.on("mouseleave", () => {
      this.opacity(1);
      this.stroke("black");
    });

    //this.initText();
  }
}

RenderedEntrance.prototype.className = "RenderedEntrance";
_registerNode(RenderedEntrance);
