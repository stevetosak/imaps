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
    const rectWidth = this.width();
    const rectHeight = this.height();

    this.infoText = new Konva.Text({
      x: this.x(),
      y: this.y(),
      text: this.info.name || "no name",
      fontSize: 10,
      fontFamily: "Exo",
      fill: "black",
      align: "center",
      verticalAlign: "middle",
    });

    this.infoText.offsetX(this.infoText.width() / 2);
    this.infoText.offsetY(this.infoText.height() / 2);

    this.infoText.x(this.x() + rectWidth / 2);
    this.infoText.y(this.y() + rectHeight / 2);
    this.infoText.rotation(this.rotation());
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


  displayName(layer) {
    if (this.infoText != null) {
      layer.add(this.infoText);
    }
  }
}
