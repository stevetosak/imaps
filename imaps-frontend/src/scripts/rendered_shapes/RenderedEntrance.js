import RenderedMapShape from "./RenderedMapShape.js";
import {_registerNode} from "konva/lib/Global";
import RenderedRoom from "./RenderedRoom.js";

export default class RenderedEntrance extends RenderedMapShape {
  constructor(attrs, scaleX, scaleY) {
    super({
      x: attrs.x,
      y: attrs.y,
      width: attrs.width * scaleX,
      height: attrs.height * scaleY,
      fill: "#4CAF50",
      stroke: "black",
      strokeWidth: 1,
      draggable: false,
      rotation: attrs.rotation,
      cornerRadius: 3,
      zIndex: 0,
    });

    this.info.name = attrs.obj_name;
    this.info.description = attrs.description;
    this.class = "Entrance";

    this.on("mouseenter", () => {
      console.log("HOVER ROOM IN", this.x());
      console.log(this.info.name, "NAME");
      this.stroke("purple");
    });
    this.on("mouseleave", () => {
      console.log("HOVER ROOM OUT");
      this.opacity(1);
      this.stroke("black");
    });

    this.initText();
  }
}

RenderedEntrance.prototype.className = "RenderedEntrance";
_registerNode(RenderedEntrance);
