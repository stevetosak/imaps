import Konva from "konva";
import config from "../net/netconfig.js";

export default class RenderedMapShape extends Konva.Shape {
  constructor(config) {
    if (new.target === RenderedMapShape) {
      throw new Error("Cannot instantiate abstract class RenderedMapShape directly.");
    }

    super(config);

    this.info = {
      name: "",
      description: "",
      type: "",
    };
    this.class = "Rect";
    this.infoText = null;
    this.textOffsetX = 0;
    this.textOffsetY = 0;

    this.eventName = "";

  }

  initText() {
    this.infoText = new Konva.Text({
      x: this.x() + this.textOffsetX,
      y: this.y() + this.textOffsetY,
      text: this.info.name || "no name",
      fontSize: 12,
      fontFamily: "Verdana",
      fill: "black",
    });
  }

  updateTextPosition() {
    if (this.infoText) {
      this.infoText.x(this.x() + this.textOffsetX);
      this.infoText.y(this.y() + this.textOffsetY);
    }
  }

  clearText() {
    if (this.infoText !== null) {
      this.infoText.remove()
      console.log("cleared text")
    }

  }
  _sceneFunc(context) {

    let width = this.width();
    let height = this.height();

    const cornerRadius = this.attrs.cornerRadius;

    context.beginPath();

    if(!cornerRadius){
      context.rect(0, 0, width, height)
    } else {
      Konva.Util.drawRoundedRectPath(context,width,height,cornerRadius)
    }

    context.closePath();
    context.fillStrokeShape(this);
  }

  addEvent(action,func){
    this.on(action,func);
  }

  displayName(layer) {
    if (this.infoText != null) {
      layer.add(this.infoText);
    }
  }
}
