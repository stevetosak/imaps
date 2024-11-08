import Konva from "konva";
import MapShape from "./MapShape";
import Factory from "../util/Factory";
import { _registerNode } from "konva/lib/Global";
export default class InfoPin extends MapShape {
  constructor(attrs,id) {

    attrs.snap = false;
    super(
      {
        x: attrs.position.x,
        y: attrs.position.y,
        radiusX: attrs.blockSize * 0.5,
        radiusY: attrs.blockSize * 0.7,
        tailHeight: attrs.blockSize * 1.2,
        fill: "#d70113",
        stroke: "#1b1b1b",
        strokeWidth: 0.2,
        draggable: true,
        name: "mapObj",
      },
      attrs.layer,
      attrs.blockSize,
      attrs.snap
    );

    this.id = id;

    this.eventName = "openPinModalEvent";

    this.connectionLines = [];

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

    this.on("dragend",() => {
      this.connectionLines.forEach(lineWrapper => {
        console.log("pred",lineWrapper.line.points())
        console.log("other",lineWrapper.otherShape)
        let updatedPoints = [this.x(),this.y(),lineWrapper.otherShape.x(),lineWrapper.otherShape.y()]
        lineWrapper.line.points(updatedPoints);
        console.log("posle",lineWrapper.line.points())
      })
    })

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

  connectTo(shape){
    let line = new Konva.Line({
      points: [this.x(),this.y(),shape.x(),shape.y()],
      stroke: "red",
      strokeWidth: 2,
      fill: "red",
    })

    let lineWrapper = {
      line: line,
      otherShape: shape
    };

    this.connectionLines.push(lineWrapper);

    let lineWrapperSend = {
      line: line,
      otherShape: this
    };

    shape.addLine(lineWrapperSend);
    this.layer.add(lineWrapper.line);
  }

  addLine(line){
    this.connectionLines.push(line);
  }

  loadInfo(attrs) {
    this.info.name = attrs.obj_name;
    this.info.selectedPins = attrs.connected_pins;
    this.info.description = attrs.description;
  }

  destroyShape() {
    super.destroyShape();
    if(this.info.selectedPins != null){

    }
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
