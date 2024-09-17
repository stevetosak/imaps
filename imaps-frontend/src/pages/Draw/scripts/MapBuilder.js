import Entrance from "./shapes/Entrance";
import Wall from "./shapes/Wall";
import Room from "./shapes/Room";
import InfoPin from "./shapes/InfoPin";
import Factory from "./util/Factory";
import Konva from "konva";
export class MapBuilder {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.stage = new Konva.Stage({
      container: containerId,
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    });

    this.gridLayer = new Konva.Layer();
    this.mainLayer = new Konva.Layer();
    this.dragLayer = new Konva.Layer();
    this.infoPinLayer = new Konva.Layer();
    this.gridLayer.listening(false);

    this.originalWidth = this.container.clientWidth;
    this.originalHeight = this.container.clientHeight;
    this.previousWidth = this.originalWidth;
    this.previousHeight = this.originalHeight;

    this.shapes = [];
    this.infoNodes = []; // unused
    this.blockSize = 10;
    this.isDrawing = false;
    this.stageRect = this.stage.container().getBoundingClientRect();

    this.mainTransformer = new Konva.Transformer({
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      anchorSize: 5,
      padding: 2,
      anchorFill: "yellow",
      borderStroke: "black",
      anchorStroke: "black",
      cornerRadius: 20,
      anchorCornerRadius: 10,
      anchorDragBoundFunc: this.transformerSnapFunc(),
    });

    this.selectionRectangle = new Konva.Rect({
      fill: "rgba(200,0,255,0.5)",
      visible: false,
      listening: false,
    });

    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.selecting = false;

    this.initialize();
  }

  initialize() {
    this.setupGrid();
    this.mainLayer.add(this.mainTransformer);
    this.mainLayer.add(this.selectionRectangle);
    this.stage.add(this.gridLayer);
    this.stage.add(this.dragLayer);
    this.stage.add(this.mainLayer);
    this.stage.add(this.infoPinLayer);
    this.setupEventListeners();
  }

  setupEventListeners() {
    document
      .getElementById("shapeOptions")
      .addEventListener("click", this.selectShape.bind(this));
    document
    .getElementById("render-button")
    .addEventListener("click",this.render.bind(this));
    window.addEventListener("keydown", this.handleDelete.bind(this));
    window.addEventListener("keydown", this.handleExitSelection.bind(this));
    window.addEventListener("keydown", this.hideInfoPinMenus.bind(this));
    window.addEventListener("resize", () => {
      this.stage.width(this.container.clientWidth);
      this.stage.height(this.container.clientHeight);
      this.handleResize();
    });
    window.addEventListener("wheel", this.handleWheel.bind(this));
    window.addEventListener("wheel", this.rotateShapesBy90.bind(this));
    this.stage.on("mousedown touchstart", this.handleMouseDown.bind(this));
    this.stage.on("mousemove touchmove", this.handleMouseMove.bind(this));
    this.stage.on("mouseup touchend", this.handleMouseUp.bind(this));
    this.stage.on("click tap", this.handleStageClick.bind(this));
    this.stage.on("contextmenu", this.addInfoPin.bind(this));
  }

  transformerSnapFunc() {
    return (oldPos, newPos) => {
      const snapDistance = 8;

      if (this.mainTransformer.getActiveAnchor() === "rotater") {
        return newPos;
      }

      const distance = Math.sqrt(
        Math.pow(newPos.x - oldPos.x, 2) + Math.pow(newPos.y - oldPos.y, 2)
      );

      if (distance > snapDistance) {
        return newPos;
      }

      const nextX = Math.round(newPos.x / this.blockSize) * this.blockSize;
      const diffX = Math.abs(newPos.x - nextX);

      const nextY = Math.round(newPos.y / this.blockSize) * this.blockSize;
      const diffY = Math.abs(newPos.y - nextY);

      const snapToX = diffX < snapDistance;
      const snapToY = diffY < snapDistance;

      if (snapToX && !snapToY) {
        return {
          x: nextX,
          y: oldPos.y,
        };
      } else if (!snapToX && snapToY) {
        return {
          x: oldPos.x,
          y: nextY,
        };
      } else if (snapToX && snapToY) {
        return {
          x: nextX,
          y: nextY,
        };
      }

      return newPos;
    };
  }

  handleResize() {
    const containerWidth = this.container.offsetWidth;
    const containerHeight = this.container.offsetHeight;
    
    const scaleX = containerWidth / this.stage.width();
    const scaleY = containerHeight / this.stage.height();

    const scale = Math.min(scaleX, scaleY);
    this.stage.width(containerWidth);
    this.stage.height(containerHeight);
    this.stage.scale({ x: scale, y: scale });

    this.scaleShapes(scale);
    if(this.previousWidth !== containerWidth || this.previousHeight !== containerHeight){
      this.setupGrid();
      this.previousWidth = containerWidth;
      this.previousHeight = containerHeight
      console.log("resized")
    }
   
    this.stage.batchDraw();
  }

  scaleShapes(scale) {
    this.shapes.forEach((shape) => {
      shape.x(shape.x() * scale);
      shape.y(shape.y() * scale);
    });
  }

  setupGrid() {
    this.gridLayer.destroyChildren();
    let width = this.container.clientWidth;
    let height = this.container.clientHeight;

    let columns = Math.ceil(width / this.blockSize);
    let rows = Math.ceil(height / this.blockSize);

    for (let i = 0; i <= columns; i++) {
      this.gridLayer.add(
        new Konva.Line({
          points: [
            i * this.blockSize + 0.5,
            0,
            i * this.blockSize + 0.5,
            height,
          ],
          stroke: "grey",
          strokeWidth: 1,
          opacity: 0.3,
        })
      );
    }
    for (let j = 0; j <= rows; j++) {
      this.gridLayer.add(
        new Konva.Line({
          points: [
            0,
            j * this.blockSize + 0.5,
            width,
            j * this.blockSize + 0.5,
          ],
          stroke: "grey",
          strokeWidth: 1,
          opacity: 0.3,
        })
      );
    }
    this.mainLayer.moveToTop();
    this.infoPinLayer.moveToTop();
  }

  hideInfoPinMenus(e){
    InfoPin.hideMenus(e,false,this.getInfoPins());
  }

  getInfoPins(){
    return this.shapes.filter(shape => shape.className === 'InfoPin');
  }

  addInfoPin(e) {
    e.evt.preventDefault();
    let mousePos = this.stage.getPointerPosition();
    let infoPin = Factory.createShape(
      "InfoPin",
      mousePos,
      this.blockSize,
      this.infoPinLayer,
      0
    );

    infoPin.init(this.stageRect);

    this.shapes.push(infoPin);
    this.infoPinLayer.add(infoPin);
    this.infoPinLayer.batchDraw();
    console.log(infoPin.name())
  }

  clickHandler() {
    return () => {
      if (this.isDrawing) {
        const mousePos = this.stage.getPointerPosition();
        const placedObj = Factory.createShape(
          this.hoverObj.type,
          mousePos,
          this.blockSize,
          this.mainLayer,
          this.hoverObj.rotation()
        );

        if (placedObj) {
          this.mainLayer.add(placedObj);
          this.shapes.push(placedObj);
          placedObj.snapToGrid();
          this.mainTransformer.nodes([placedObj]);
          this.mainLayer.draw();
          this.isDrawing = false;
          this.hoverObj.remove();
          this.dragLayer.removeChildren();
          this.stage.off("mousemove", this.mouseMoveHandler());
          this.stage.off("click", this.clickHandler());
        }
      }
    };
  }

  mouseMoveHandler() {
    return () => {
      if (this.isDrawing) {
        const mousePos = this.stage.getPointerPosition();
        this.hoverObj.position({ x: mousePos.x, y: mousePos.y });
        this.hoverObj.visible(true);
        this.dragLayer.batchDraw();
      }
    };
  }

  startDrawing(shapeType) {
    this.isDrawing = true;
    let pos = { x: 0, y: 0 };
    this.hoverObj = Factory.createShape(
      shapeType,
      pos,
      this.blockSize,
      this.dragLayer,
      0
    );
    this.hoverObj.visible(false);
    this.dragLayer.add(this.hoverObj);
    this.dragLayer.moveToTop();
    this.stage.on("mousemove", this.mouseMoveHandler());
    this.stage.on("click", this.clickHandler());
  }

  selectShape(e) {
    if (e.target.tagName === "LI") {
      const shape = e.target.getAttribute("data-info");
      this.startDrawing(shape);
      this.mainTransformer.nodes([]);
    }
  }

  rotateShapesBy90() {
    this.mainTransformer.nodes().forEach((node) => {
      node.rotate(90);
    });
  }

  handleDelete(e) {
    if (e.key === "Delete") {
      this.mainTransformer.nodes().forEach((node) => {
        node.remove();
        this.shapes.splice(this.shapes.indexOf(node), 1);
        if (node.className === "InfoPin") {
          node.infoBox.remove();
        }
      });
      this.mainTransformer.nodes([]);
      this.mainLayer.batchDraw();
      console.log(this.shapes.length);
    }
  }

  handleExitSelection(e) {
    if (e.key === "Escape") {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.hoverObj.remove();
      }
    }
  }

  handleWheel() {
    if (this.hoverObj) {
      this.hoverObj.rotate(90);
      this.dragLayer.batchDraw();
    }
  }

  handleMouseDown(e) {
    if (e.target !== this.stage) {
      return;
    }
    e.evt.preventDefault();
    this.x1 = this.stage.getPointerPosition().x;
    this.y1 = this.stage.getPointerPosition().y;
    this.x2 = this.stage.getPointerPosition().x;
    this.y2 = this.stage.getPointerPosition().y;

    this.selectionRectangle.width(0);
    this.selectionRectangle.height(0);
    this.selecting = true;
  }

  handleMouseMove(e) {
    if (!this.selecting) {
      return;
    }
    e.evt.preventDefault();
    this.x2 = this.stage.getPointerPosition().x;
    this.y2 = this.stage.getPointerPosition().y;

    this.selectionRectangle.setAttrs({
      visible: true,
      x: Math.min(this.x1, this.x2),
      y: Math.min(this.y1, this.y2),
      width: Math.abs(this.x2 - this.x1),
      height: Math.abs(this.y2 - this.y1),
    });
  }

  handleMouseUp(e) {
    this.selecting = false;
    if (!this.selectionRectangle.visible()) {
      return;
    }
    e.evt.preventDefault();
    this.selectionRectangle.visible(false);
    const shapes = this.stage.find(".mapObj");
    const box = this.selectionRectangle.getClientRect();
    const selected = shapes.filter((shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    );
    this.mainTransformer.nodes(selected);
    console.log(this.mainTransformer.nodes());
  }

  saveShapeDetails(){
    this.shapes
    .filter(shape => shape.className === 'Room')
    .forEach(room => room.saveShapeDetails());
  }

  async render(){
    InfoPin.hideMenus(null,true,this.getInfoPins());
    this.saveShapeDetails();
    var json = {
      attrs: {
        width: this.container.clientWidth,
        height: this.container.clientHeight
      },
      className: "Stage",
      Layer: [
        {
          attrs: {},
          className: "Layer",
          children: []
        }
      ]
    };

    json.Layer[0].children.push(this.shapes);

    try{

      var mapId = window.location.pathname.split("/")[2]
      const response = await fetch("http://localhost:8080/api/render",{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Sender-Url': window.location.pathname
        },
        body: JSON.stringify(json)
      });
    

      if(!response.ok){
        console.log("ERROR VO PUSTANJE");
      }


      const result = await response.json();

      console.log("RESPONSE FROM BACKEND: " + JSON.stringify(result));


    } catch(error){

    }
    
    //this.shapes.forEach(shape => console.log(shape.toJSON()))
  }

  handleStageClick(e) {
    if (this.selectionRectangle.visible()) {
      return;
    }

    if (e.target === this.stage) {
      this.mainTransformer.nodes([]);
      InfoPin.hideMenus(e,true,this.getInfoPins()); // ne na sekoe
      return;
    }

    if (!e.target.hasName("mapObj")) {
      console.log("vleze")
      return;
    }

    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = this.mainTransformer.nodes().indexOf(e.target) >= 0;

    if (!metaPressed && !isSelected) {
      this.mainTransformer.nodes([e.target]);
    } else if (metaPressed && isSelected) {
      const nodes = this.mainTransformer.nodes().slice();
      nodes.splice(nodes.indexOf(e.target), 1);
      this.mainTransformer.nodes(nodes);
    } else if (metaPressed && !isSelected) {
      const nodes = this.mainTransformer.nodes().concat([e.target]);
      this.mainTransformer.nodes(nodes);
    }
  }
}
