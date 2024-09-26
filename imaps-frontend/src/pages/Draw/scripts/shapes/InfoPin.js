import Konva from "konva";
import styles from "../../Draw.module.css"
import MapShape from "./MapShape";
import Factory from "../util/Factory";
import { _registerNode } from 'konva/lib/Global';
export default class InfoPin extends MapShape {
  constructor(mousePos,blockSize,layer,snappable) {
    super(
      {
        x: mousePos.x,
        y: mousePos.y,
        radiusX: blockSize / 3,
        radiusY: blockSize * 0.45,
        tailHeight: blockSize * 0.8,
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

    this.modalEventName = "openPinModalEvent";
  
    this._info = {
      pinName: '',
      connections: [],
      description: '',
    };

    this.on("mouseover", () => {
      this.fill("yellow");
    });
    this.on("mouseout", () => {
      this.fill("red");
    });

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

  saveShapeDetails(){
    this.setAttr("pin_name",this.info.pinName);
    this.setAttr("connections",this.info.connections);
    this.setAttr("description",this.info.description);
  }

}

InfoPin.prototype.className = 'InfoPin'
_registerNode(InfoPin);
