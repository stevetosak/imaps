import { Entrance, Room, Wall } from "./Shapes";
import InfoNode from "./InfoNode";
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
    this.dragLayer = new Konva.Layer();
    this.mainLayer = new Konva.Layer();
    this.infoPinLayer = new Konva.Layer();
    this.gridLayer.listening(false);

    this.shapes = [];
    this.infoNodes = [];
    this.selectedShapes = [];
    this.blockSize = 15;
    this.isDrawing = false;

    this.pinCount = 0;

    this.mainTransformer = new Konva.Transformer({
      centeredScaling: false,
      rotationSnaps: [0, 90, 180, 270],
      anchorSize: 5,
      padding:2,
      anchorFill: "yellow",
      borderStroke: "black",
      anchorStroke: "black",
      cornerRadius: 20,
      anchorCornerRadius: 10,
      anchorDragBoundFunc: this.initTransformer.bind(this),
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
    this.stage.add(this.infoPinLayer)
    this.setupEventListeners();
  }

  initTransformer(oldPos, newPos) {
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
    this.setupGrid();
    this.stage.draw();
  }

  scaleShapes(scale) {
    this.shapes.forEach((shape) => {
      shape.x(shape.x() * scale);
      shape.y(shape.y() * scale);
    });
  }

  setupEventListeners() {
    document
      .getElementById("shapeOptions")
      .addEventListener("click",this.selectShape.bind(this));
    window.addEventListener("keydown", this.handleDelete.bind(this));
    window.addEventListener("keydown", this.handleExitSelection.bind(this));
    window.addEventListener("resize", () => {
      this.stage.width(this.container.clientWidth);
      this.stage.height(this.container.clientHeight);
      this.handleResize();
    });
    window.addEventListener("wheel", this.handleWheel.bind(this));
    this.stage.on("mousedown touchstart", this.handleMouseDown.bind(this));
    this.stage.on("mousemove touchmove", this.handleMouseMove.bind(this));
    this.stage.on("mouseup touchend", this.handleMouseUp.bind(this));
    this.stage.on("click tap", this.handleStageClick.bind(this));
    this.stage.on("contextmenu", this.addInfoPin.bind(this));
  }


  setupGrid() {
    this.gridLayer.destroyChildren();
    let padding = this.blockSize;
    let width = this.container.clientWidth;
    let height = this.container.clientHeight

    for (let i = 0; i < width / padding; i++) {
      this.gridLayer.add(
        new Konva.Line({
          points: [
            Math.round(i * padding) + 0.5,
            0,
            Math.round(i * padding) + 0.5,
            height,
          ],
          stroke: "grey",
          strokeWidth: 1,
        })
      );
    }
    for (let j = 0; j < height / padding; j++) {
      this.gridLayer.add(
        new Konva.Line({
          points: [0, Math.round(j * padding), width, Math.round(j * padding)],
          stroke: "grey",
          strokeWidth: 1,
        })
      );
    }
    this.mainLayer.moveToTop();
    this.infoPinLayer.moveToTop();
   
  }

  
  positionInfoPinMenu(node){
    const options = document.getElementById('nodeOptions');
    const shapePos = node.getClientRect();
    const stagePos = this.stage.container().getBoundingClientRect();
    options.style.display = 'block';
    
    const optionsBoxX = stagePos.left + shapePos.x + (shapePos.width / 2);
    const optionsBoxY = stagePos.top + shapePos.y - options.offsetHeight;
    
    options.style.left = `${optionsBoxX}px`
    options.style.top = `${optionsBoxY}px`
  }
  
  addInfoPin(e){
    
    e.evt.preventDefault();
    let mousePos = this.stage.getPointerPosition();
    let infoPin = new InfoNode({
      x: mousePos.x,
      y: mousePos.y,
      radiusX: 5,
      radiusY: 7,
      tailHeight: 10,
      fill: '#d70113',
      stroke: '#1b1b1b',
      strokeWidth: 0.2,
      draggable: true,
      name: 'mapObj',
    });
    
    infoPin.createInfoBox(this.pinCount++);
    
    infoPin.on('dblclick', () => {
      infoPin.displayInfoBox(this.stage,false);
      infoPin.moveToTop();
    })
    
    infoPin.on('dragend', () => {
      if(infoPin.isDisplayingBox){
        infoPin.displayInfoBox(this.stage,true);
      }
    })
    
    this.shapes.push(infoPin);
    this.infoPinLayer.add(infoPin);
    this.infoPinLayer.batchDraw();  
  }
  
  clickHandler() {
    return () => {
      if (this.isDrawing) {
        const mousePos = this.stage.getPointerPosition();
        const placedObj = this.createShape(this.hoverObj.type,mousePos,this.hoverObj.rotation(),this.mainLayer);
        if (placedObj) {
          this.mainLayer.add(placedObj);
          this.shapes.push(placedObj);
          //this.mainTransformer.nodes([placedObj]);
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
  
  createShape(objType,position,rotation,layer) {
    switch (objType) {
      case "Entrance":
        return new Entrance(position, this.blockSize, layer, rotation);
      case "Room":
        return new Room(position, this.blockSize, layer, rotation);
      case "Wall":
        return new Wall(position, this.blockSize, layer, rotation);
      default:
        return null;
    }
  }

  startDrawing(shapeType) {
    this.isDrawing = true;
    this.hoverObj = this.createShape(shapeType,{x:0,y:0},0,this.dragLayer)
    this.hoverObj.visible(false);
    this.dragLayer.add(this.hoverObj);
    this.stage.on("mousemove", this.mouseMoveHandler());
    this.stage.on("click", this.clickHandler());
  }

  selectShape(e) {
    if (e.target.tagName === "LI") {
      const shape = e.target.getAttribute("data-info");
      this.startDrawing(shape)
    }
  }

  handleDelete(e) {
    if (e.key === "Delete") {
      this.mainTransformer.nodes().forEach((node) => {
        node.remove();
        this.shapes.splice(this.shapes.indexOf(node), 1);
        if(node.className === 'InfoPin'){
          node.destroySelf();
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
  }

  handleStageClick(e) {

    if (this.selectionRectangle.visible()) {
      return;
    }

    if (e.target === this.stage) {
      this.mainTransformer.nodes([]);
      return;
    }

    if (!e.target.hasName("mapObj")) {
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
