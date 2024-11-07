import Konva from "konva";

export default class RenderedMapShape extends Konva.Rect {
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

  displayName(layer) {
    if (this.infoText != null) {
      layer.add(this.infoText);
    }
  }
}
