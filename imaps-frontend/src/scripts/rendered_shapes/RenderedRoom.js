import RenderedMapShape from "../base/RenderedMapShape.js";
import {_registerNode} from "konva/lib/Global";

export default class RenderedRoom extends RenderedMapShape {
  constructor(attrs, scaleX, scaleY) {
    super({
      x: attrs.x,
      y: attrs.y,
      width: attrs.width,
      height: attrs.height,
      fill: "#A2D9FF",
      stroke: "black",
      strokeWidth: 1,
      draggable: false,
      rotation: attrs.rotation,
      cornerRadius: 3
    });

    console.info("FNUM RENDER:",attrs.floor_num)

    this.floorNum = attrs.floor_num

    this.info.name = attrs.obj_name;
    this.info.type = attrs.room_type;
    this.info.description = attrs.description;
    this.class = "Room";
    this.textOffsetX = -50;

    this.eventName = "openRoomInfoPanel"

    this.on("mouseenter", () => {
      console.log(this.info.name, "NAME");
      this.fill("#65c3f8");
    });
    this.on("mouseleave", () => {
      this.fill("#A2D9FF");
    });



    // searched(){
    //   this.fill("#b92d39")
    // }
    // unsearched(){
    //   this.fill("#A2D9FF");
    // }

    // console.log("ATTRS: " + attrs);

    this.initText();
  }
  highlight(){
    this.fill("rgba(29,238,78,0.49)");
    this.strokeWidth(2)
  }
  unHighlight(){
    this.fill("#A2D9FF");
    this.strokeWidth(1);
  }
}
RenderedRoom.prototype.className = "RenderedRoom";
_registerNode(RenderedRoom);
