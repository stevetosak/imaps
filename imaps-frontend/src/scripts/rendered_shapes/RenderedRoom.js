import RenderedMapShape from "./RenderedMapShape.js";
import {_registerNode} from "konva/lib/Global";

export default class RenderedRoom extends RenderedMapShape {
  constructor(attrs, scaleX, scaleY) {
    super({
      x: attrs.x,
      y: attrs.y,
      width: attrs.width * scaleX,
      height: attrs.height * scaleY,
      fill: "white",
      stroke: "black",
      strokeWidth: 1,
      draggable: false,
      rotation: attrs.rotation,
      cornerRadius: 3,
      zIndex: 0,
    });

    this.info.name = attrs.obj_name;
    this.info.type = attrs.room_type;
    this.info.description = attrs.description;
    this.class = "Room";
    this.textOffsetX = -50;

    this.eventName = "openRoomInfoPanel"

    this.on("mouseenter", () => {
      console.log("HOVER ROOM IN", this.x());
      console.log(this.info.name, "NAME");
      this.opacity(0.7);
      this.fill("pink");
    });
    this.on("mouseleave", () => {
      console.log("HOVER ROOM OUT");
      this.opacity(1);
      this.fill("white");
    });

    // console.log("ATTRS: " + attrs);

    this.initText();
  }
}
RenderedRoom.prototype.className = "RenderedRoom";
_registerNode(RenderedRoom);
