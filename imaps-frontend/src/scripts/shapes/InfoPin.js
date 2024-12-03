
import { _registerNode } from "konva/lib/Global";
import MapNode from "../base/MapNode.js";
import {node} from "prop-types";
import draw from "../../pages/Draw/Draw.jsx";
export default class InfoPin extends MapNode {
  constructor(attrs,id) {
    attrs.snap = false;
    super(
      {
        x: attrs.position.x,
        y: attrs.position.y,
        radiusX: attrs.blockSize * 0.5,
        radiusY: attrs.blockSize * 0.7,
        tailHeight: attrs.blockSize * 1.2,
        fill: "#f60000",
        stroke: "#1b1b1b",
        strokeWidth: 1,
        draggable: true,
        name: "mapObj",
      },
      attrs.layer,
      attrs.blockSize,
      attrs.snap
    );

    this.id = id;
    this.eventName = "openPinModalEvent";
    this.floorNum = attrs.floorNum;

    this.type = "InfoPin";
    this._info = {
      name: `Pin${id} [${this.floorNum}F]`,
      selectedPins: [],
      description: "",
    };

    this.on("mouseover", () => {
      this.fill("#FFD700");
    });
    this.on("mouseout", () => {
      this.fill("#f60000");
    });


    this.initText();
  }
  _sceneFunc(context, shape) {
    const { radiusX, radiusY, tailHeight } = this.attrs; // attrs od konva

    context.beginPath();
    context.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
    context.closePath();
    context.fillStrokeShape(shape);

    context.beginPath();
    context.moveTo(-radiusX, radiusY);
    context.lineTo(0, radiusY + tailHeight);
    context.lineTo(radiusX, radiusY);
    context.closePath();

    context.fillStrokeShape(shape);
  }


  loadInfo(attrs) {
    this.info.name = attrs.obj_name;
    this.info.selectedPins = attrs.connected_pins;
    this.info.description = attrs.description;
    this.floorNum = attrs.floor_num
  }

  saveShapeDetails() {
    this.setAttr("obj_name", this.info.name);
    this.setAttr("connected_pins", this.info.selectedPins);
    this.setAttr("description", this.info.description);
    this.setAttr("floor_num",this.floorNum)
    console.log(this.info, "vnatre vo info");
  }

  connect(node, draw = true) {
    if(this.floorNum !== node.floorNum) return;

    super.connect(node)
  }
}

InfoPin.prototype.className = "InfoPin";
_registerNode(InfoPin);
