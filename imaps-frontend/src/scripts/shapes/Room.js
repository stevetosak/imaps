import Konva from "konva";
import MapShape from "./MapShape";
import { _registerNode } from "konva/lib/Global";
export default class Room extends MapShape {
  constructor(mousePos, blockSize, layer, rotation, snap, id) {
    super(
      {
        x: mousePos.x,
        y: mousePos.y,
        width: blockSize * 8,
        height: blockSize * 4,
        fill: "#DDE0F8",
        stroke: "grey",
        strokeWidth: 1,
        name: "mapObj",
        rotation: rotation,
        draggable: true,
      },
      layer,
      blockSize,
      snap
    );

    this._info = {
      name: "Room " + Math.floor(Math.random() * 100) + 1,
      type: "",
      description: "",
    };

    this.type = "Room";
    this.modalEventName = "openRoomModalEvent";
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
