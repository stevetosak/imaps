import { Entrance, Room, Wall} from './Shapes';
import Konva from 'konva'
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
      this.gridLayer.listening(false);

      this.shapes = [];
      this.blockSize = 20;
      this.isDrawing = false;
      this.currentType = "";

      this.tr = new Konva.Transformer({
        centeredScaling: false,
        rotationSnaps: [0, 90, 180, 270],
        anchorSize: 5,
        anchorFill: "yellow",
        borderStroke: "black",
        anchorStroke: "black",
        cornerRadius: 20,
        padding: 5,

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
      this.mainLayer.add(this.tr);
      this.mainLayer.add(this.selectionRectangle);
      this.stage.add(this.dragLayer);
      this.stage.add(this.mainLayer);
      this.setupEventListeners();
    }

    initTransformer(oldPos, newPos, e) {
      const snapDistance = 5;

      if (this.tr.getActiveAnchor() === "rotater") {
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
      console.log(this.stage.width(), this.stage.height());
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
        .getElementById("add")
        .addEventListener("click", this.objectTypeSelection.bind(this));
      document
        .getElementById("dropdownOptions")
        .addEventListener("change", this.handleSelectionChange.bind(this));
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
    }

    setupGrid() {
      this.gridLayer.destroyChildren();
      let padding = this.blockSize;
      let width = this.container.clientWidth;
      let height = this.container.clientHeight;

      for (let i = 0; i < width / padding; i++) {
        this.gridLayer.add(
          new Konva.Line({
            points: [
              Math.round(i * padding) + 0.5,
              0,
              Math.round(i * padding) + 0.5,
              height,
            ],
            stroke: "#ddd",
            strokeWidth: 1,
          })
        );
      }
      for (let j = 0; j < height / padding; j++) {
        this.gridLayer.add(
          new Konva.Line({
            points: [
              0,
              Math.round(j * padding),
              width,
              Math.round(j * padding),
            ],
            stroke: "#ddd",
            strokeWidth: 0.5,
          })
        );
      }
      this.stage.add(this.gridLayer);
    }

    createShape(mousePos, rotation) {
      switch (this.currentType) {
        case "Entrance":
          return new Entrance(
            mousePos,
            this.blockSize,
            this.dragLayer,
            rotation
          );
        case "Room":
          return new Room(mousePos, this.blockSize, this.dragLayer, rotation);
        case "Wall":
          return new Wall(mousePos, this.blockSize, this.dragLayer, rotation);
        default:
          return null;
      }
    }

    clickHandler() {
      return () => {
        if (this.isDrawing) {
          const mousePos = this.stage.getPointerPosition();
          const placedObj = this.createShape(
            mousePos,
            this.hoverObj.rotation()
          );
          if (placedObj) {
            console.log(
              "STATS:" + placedObj.x(),
              placedObj.y(),
              placedObj.width(),
              placedObj.height()
            );

            this.mainLayer.add(placedObj);
            this.shapes.push(placedObj);
            this.tr.nodes([placedObj]);
            this.mainLayer.draw();
            this.isDrawing = false;
            this.hoverObj.remove();
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
          this.mainLayer.batchDraw();
        }
      };
    }

    createHoverObject(type) {
      switch (type) {
        case "Entrance":
          return new Entrance({ x: 0, y: 0 }, this.blockSize, this.gridLayer);
        case "Room":
          return new Room({ x: 0, y: 0 }, this.blockSize, this.gridLayer);
        case "Wall":
          return new Wall({ x: 0, y: 0 }, this.blockSize, this.gridLayer);
        default:
          return null;
      }
    }

    startDrawing(shapeType) {
      this.isDrawing = true;
      this.currentType = shapeType;
      this.hoverObj = this.createHoverObject(shapeType);
      this.hoverObj.visible(false);
      this.mainLayer.add(this.hoverObj);
      this.stage.on("mousemove", this.mouseMoveHandler());
      this.stage.on("click", this.clickHandler());
    }

    objectTypeSelection() {
      const dropdown = document.getElementById("dropdownOptions");
      console.log(dropdown.options.length);
      if (dropdown.options.length === 0) {
        const options = ["Entrance", "Wall", "Room", "Hallway", "Stairs"];
        options.forEach((option) => {
          const optionElement = document.createElement("option");
          optionElement.value = option;
          optionElement.text = option;
          dropdown.add(optionElement);
        });
      } else {
        const dropdownContainer = document.getElementById("dropdown");
        console.log(dropdownContainer.style.display);
        dropdownContainer.style.display =
          dropdownContainer.style.display === "none" ||
          dropdownContainer.style.display === ""
            ? "block"
            : "none";
      }
    }

    handleSelectionChange() {
      const dropdown = document.getElementById("dropdownOptions");
      const selected = dropdown.value;
      console.log(dropdown.value);
      document.getElementById("selectedOption").innerText = `${selected}`;
      this.startDrawing(`${selected}`);
    }

    handleDelete(e) {
      if (e.key === "Delete") {
        const selectedNodes = this.tr.nodes();
        selectedNodes.forEach((node) => {
          node.remove();
          this.shapes.splice(this.shapes.indexOf(node), 1);
        });
        this.tr.nodes([]);
        this.mainLayer.batchDraw();
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
        this.mainLayer.batchDraw();
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
      this.tr.nodes(selected);
    }

    handleStageClick(e) {
      if (this.selectionRectangle.visible()) {
        return;
      }

      if (e.target === this.stage) {
        this.tr.nodes([]);
        return;
      }

      if (!e.target.hasName("mapObj")) {
        return;
      }

      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = this.tr.nodes().indexOf(e.target) >= 0;

      if (!metaPressed && !isSelected) {
        this.tr.nodes([e.target]);
      } else if (metaPressed && isSelected) {
        const nodes = this.tr.nodes().slice();
        nodes.splice(nodes.indexOf(e.target), 1);
        this.tr.nodes(nodes);
      } else if (metaPressed && !isSelected) {
        const nodes = this.tr.nodes().concat([e.target]);
        this.tr.nodes(nodes);
      }
    }
  }