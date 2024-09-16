import Konva from "konva";

export default class RenderedMapShape extends Konva.Shape{
    constructor(config){
        if (new.target === RenderedMapShape) {
            throw new Error("Cannot instantiate abstract class BaseShape directly.");
          }

          super(config);

    }

    _sceneFunc(context){
        let width = this.width();
        let height = this.height();
        context.beginPath();
        context.rect(0,0,width,height)
        context.closePath();
        context.fillStrokeShape(this);  
      }
    
}