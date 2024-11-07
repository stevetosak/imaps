import Konva from "konva";
import MapShape from "./MapShape";
import { _registerNode } from "konva/lib/Global";
export default class Room extends MapShape {
  constructor(attrs,id){

      if(!attrs.fromLoad){
          attrs.width *= 8;
          attrs.height *= 4;
      }

      console.log(attrs.position,"hehe")
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
        rotation: attrs.rotation,
        draggable: true,
      },
        attrs.layer,
        attrs.blockSize,
        attrs.snap
    );

    this._info = {
      name: `Room ${id}`,
      type: "",
      description: "",
    };

    this.type = "Room";
    this.eventName = "openRoomModalEvent";
    this.id = id;

    this.initText();
  }

  loadInfo(attrs) {
    this.info.name = attrs.obj_name;
    this.info.type = attrs.room_type;
    this.info.description = attrs.description;
  }

  saveShapeDetails() {
    this.setAttr("obj_name", this.info.name);
    this.setAttr("room_type", this.info.type);
    this.setAttr("description", this.info.description);
  }
}

Room.prototype.className = "Room";
_registerNode(Room);
