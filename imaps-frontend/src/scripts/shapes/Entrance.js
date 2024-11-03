import Konva from "konva";
import MapShape from "./MapShape";
import { _registerNode } from "konva/lib/Global";
export default class Entrance extends MapShape {
  constructor(attribs,id) {
    super(
      {
        x: attribs.position.x,
        y: attribs.position.y,
        width: attribs.blockSize * attribs.scaleX,
        height: attribs.blockSize * 2 * attribs.scaleY,
        fill: "#0051ff",
        stroke: "grey",
        strokeWidth: 1,
        opacity: 0.7,
        name: "mapObj",
        draggable: true,
        rotation: attribs.rotation,
        zIndex: 1,
      },
      attribs.layer,
      attribs.blockSize,
      attribs.snap
    );
    this.type = "Entrance";
    this.modalEventName = "openEntranceModalEvent";

    this.id = id;

    this._info = {
      name: `Entrance ${id}`,
      connectedRoom: "",
      description: "",
      isMainEntrance: false,
      selectedPin: "",
      selectedPins: [],
    };

    this.initText();
  }

  loadInfo(attrs) {
    this.info.name = attrs.obj_name;
    this.info.connectedRoom = attrs.connected_room;
    this.info.description = attrs.description;
    this.info.isMainEntrance = attrs.is_main_entrance;
    this.info.selectedPins = attrs.connected_pins;
  }

  saveShapeDetails() {
    this.setAttr("connected_pins", this.info.selectedPins);
    this.setAttr("obj_name", this.info.name);
    this.setAttr("description", this.info.description);
    this.setAttr("is_main_entrance", this.info.isMainEntrance);
    this.setAttr("connected_room", this.info.connectedRoom);
  }
}

Entrance.prototype.className = "Entrance";
_registerNode(Entrance);
