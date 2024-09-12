import Konva from "konva";
export default class MapShape extends Konva.Shape {
  constructor(config,layer,blockSize,snap) {
    if (new.target === MapShape) {
      throw new Error("Cannot instantiate abstract class BaseShape directly.");
    }
    super(config);
    this.layer = layer;
    this.blockSize = blockSize;
    this._type = "";
    this.snappable = snap;

    this.shadowForStrokeEnabled(false);
    this.on("mouseover", () => (document.body.style.cursor = "pointer"));
    this.on("mouseout", () => (document.body.style.cursor = "default"));
    this.on("dblclick", () => {
      this.moveToTop();
      this.getLayer()
        .find("Transformer")
        .forEach((t) => t.moveToTop());
    });

    if(snap){
      this.on("dragend",this.snapToGrid.bind(this));
      this.on('dblclick',this.snapToGrid.bind(this))
    }
    
    this.on("transform", () => {
      const scaleX = this.scaleX();
      const scaleY = this.scaleY();
      this.strokeWidth(1 / Math.max(scaleX, scaleY));
    });
  }

    _sceneFunc(context){
      let width = this.width();
      let height = this.height();
      context.beginPath();
      context.rect(0,0,width,height)
      context.closePath();
      context.fillStrokeShape(this);  
    }

  snapToGrid(){
      this.position({
        x: Math.round(this.x() / this.blockSize) * this.blockSize,
        y: Math.round(this.y() / this.blockSize) * this.blockSize,
      });
  }

  get type(){
    return this._type;
  }

  set type(type){
    this._type = type
  }
 
}