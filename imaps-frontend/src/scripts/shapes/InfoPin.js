import Konva from "konva";
import MapShape from "./MapShape";
import Factory from "../util/Factory";
import { _registerNode } from "konva/lib/Global";
export default class InfoPin extends MapShape {
  constructor(mousePos, blockSize, layer, snappable,id) {
    super(
      {
        x: mousePos.x,
        y: mousePos.y,
        radiusX: blockSize * 0.5,
        radiusY: blockSize * 0.7,
        tailHeight: blockSize * 1.2,
        fill: "#d70113",
        stroke: "#1b1b1b",
        strokeWidth: 0.2,
        draggable: true,
        name: "mapObj",
      },
      layer,
      blockSize,
      snappable
    );

    this.id = id;

    this.modalEventName = "openPinModalEvent";
    this.type = "InfoPin";
    this._info = {
      name: `Pin ${id}`,
      selectedPins: [],
      description: "",
    };

    this.on("mouseover", () => {
      this.fill("yellow");
    });
    this.on("mouseout", () => {
      this.fill("red");
    });

    this.initText();
  }
  _sceneFunc(context, shape) {
    const { radiusX, radiusY, tailHeight } = this.attrs;

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
  }

  saveShapeDetails() {
    this.setAttr("obj_name", this.info.name);
    this.setAttr("connected_pins", this.info.selectedPins);
    this.setAttr("description", this.info.description);
    console.log(this.info, "vnatre vo info");
  }
}

InfoPin.prototype.className = "InfoPin";
_registerNode(InfoPin);
