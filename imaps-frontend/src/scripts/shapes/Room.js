import Konva from "konva";
import MapShape from "./MapShape";
import { _registerNode } from "konva/lib/Global";
export default class Room extends MapShape {
  constructor(attribs,scaleX,scaleY,id){
      let width = attribs.width * scaleX;
      let height = attribs.height * scaleY;

      console.log("AAAAAAAAAAAAAT",attribs.position)

      if(!attribs.fromLoad){
          // ako ne bile loadnati znacit gi klavame nie,taka da inicijalna vrednost na width i height e blockSize.
          width *= 8;
          height *= 4;
      }
    super(
      {
        x: attribs.position.x,
        y: attribs.position.y,
        width: width,
        height: height,
        fill: "#DDE0F8",
        stroke: "grey",
        strokeWidth: 1,
        name: "mapObj",
        rotation: attribs.rotation,
        draggable: true,
      },
        attribs.layer,
        attribs.blockSize,
        attribs.snap
    );

    this._info = {
      name: `Room ${id}`,
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
