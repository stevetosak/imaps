import Konva from "konva";

export default class RenderedMapShape extends Konva.Rect{
    constructor(config){
        if (new.target === RenderedMapShape) {
            throw new Error("Cannot instantiate abstract class RenderedMapShape directly.");
          }

          super(config);

          this.info = {
            name: "",
            description: "",
          }
          this.infoText = null;;
    }

    initText() {
      this.textOffsetX = 0;
      this.textOffsetY = -30;
      this.infoText = new Konva.Text({
        x: this.x() + this.textOffsetX,
        y: this.y() + this.textOffsetY,
        text: this.info.name || "no name",
        fontSize: 12,
        fontFamily: 'Verdana',
        fill: 'black',
      });
    }
  
    updateTextPosition() {
      if(this.infoText){
        this.infoText.x(this.x() + this.textOffsetX);
        this.infoText.y(this.y() + this.textOffsetY);
      }
    }
  
    displayName(layer) {
        layer.add(this.infoText);
    }
    
}