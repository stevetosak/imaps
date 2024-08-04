class MapShape extends Konva.Rect {
  constructor(config, layer, blockSize) {
    if (new.target === MapShape) {
      throw new Error("Cannot instantiate abstract class BaseShape directly.");
    }
    super(config);
    this.layer = layer;
    this.blockSize = blockSize;
    this.shadowObj = null;
    this.shadowForStrokeEnabled(false);
    this.on("mouseover", () => (document.body.style.cursor = "pointer"));
    this.on("mouseout", () => (document.body.style.cursor = "default"));
    this.on("dblclick", () => {
      this.moveToTop();
      this.getLayer()
        .find("Transformer")
        .forEach((t) => t.moveToTop());
    });
    this.on("dragstart", () => {
      this.showDragShadow();
    });
    this.on("dragmove", () => {
      this.moveDragShadow();
    });
    this.on("dragend", () => {
      this.snapToGrid();
      this.hideDragShadow();
    });
  }

  createShadowObj() {
    throw new Error("Abstract method 'createShadowObj' must be implemented in subclass.");
  }

  showDragShadow() {
    if (this.shadowObj !== null) {
      this.shadowObj.show();
      this.layer.add(this.shadowObj);
      this.shadowObj.moveToTop();
      this.moveToTop();
    } else {
      console.log("shadowObj null");
    }
  }

  moveDragShadow() {
    if (this.shadowObj !== null) {
      this.shadowObj.position({
        x: Math.round(this.x() / this.blockSize) * this.blockSize,
        y: Math.round(this.y() / this.blockSize) * this.blockSize,
      });
      this.layer.batchDraw();
    } else {
      console.log("shadowObj null");
    }
  }

  hideDragShadow() {
    if (this.shadowObj !== null) {
      this.position({
        x: Math.round(this.x() / this.blockSize) * this.blockSize,
        y: Math.round(this.y() / this.blockSize) * this.blockSize,
      });
      this.layer.batchDraw();
      this.shadowObj.hide();
    } else {
      console.log("shadowObj null");
    }
  }

  snapToGrid() {
    this.position({
      x: Math.round(this.x() / this.blockSize) * this.blockSize, // TODO TUKA BLOCK SIZE
      y: Math.round(this.y() / this.blockSize) * this.blockSize,
    });
  }
}

class LineEntrance extends MapShape {
  constructor(mousePos, blockSize, layer) {
    super(
      {
        x: mousePos.x,
        y: mousePos.y,
        width: blockSize,
        height: blockSize * 2,
        fill: "#35637c",
        stroke: "darkgrey",
        strokeWidth: 1,
        shadowColor: "black",
        shadowBlur: 2,
        shadowOffset: { x: 1, y: 1 },
        shadowOpacity: 0.4,
        name: "mapObj",
        draggable: true,
      },
      layer,
      blockSize
    );
  }

  createShadowObj() {
    this.shadowObj = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.blockSize,
      height: this.blockSize * 2,
      fill: "purple",
      opacity: 0.6,
      stroke: "purple",
      strokeWidth: 3,
      dash: [20, 2],
    });
  }
}

class RectRoom extends MapShape {
  constructor(mousePos, blockSize, layer) {
    super(
      {
        x: mousePos.x,
        y: mousePos.y,
        width: blockSize * 5,
        height: blockSize * 3,
        fill: "white",
        stroke: "darkgrey",
        strokeWidth: 2,
        name: "mapObj",
        draggable: true,
      },
      layer,
      blockSize
    );
  }

  createShadowObj() {
    this.shadowObj = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.blockSize * 5,
      height: this.blockSize * 3,
      fill: "purple",
      opacity: 0.6,
      stroke: "purple",
      strokeWidth: 3,
      dash: [20, 2],
    });
  }
}

class LineWall extends MapShape {
  constructor(mousePos, blockSize, layer) {
    super(
      {
        x: mousePos.x,
        y: mousePos.y,
        width: blockSize,
        height: blockSize * 8,
        fill: "#e8e8e8",
        stroke: "grey",
        strokeWidth: 1,
        name: "mapObj",
        draggable: true,
      },
      layer,
      blockSize
    );
  }

  createShadowObj() {
    this.shadowObj = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.blockSize,
      height: this.blockSize * 8,
      fill: "purple",
      opacity: 0.6,
      stroke: "darkgrey",
      strokeWidth: 3,
      dash: [20, 2],
    });
  }
}

class MapBuilder {
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
    this.mainLayer.moveToTop();
    this.isDrawing = false;
    this.blockSize = 30;
    this.shapes = [];
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
    document.getElementById("add").addEventListener("click", this.objectTypeSelection.bind(this));
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

  createShape(mousePos) {
    switch (this.currentType) {
      case "Entrance":
        return new LineEntrance(mousePos, this.blockSize, this.dragLayer);
      case "Room":
        return new RectRoom(mousePos, this.blockSize, this.dragLayer);
      case "Wall":
        return new LineWall(mousePos, this.blockSize, this.dragLayer);
      default:
        return null;
    }
  }

  clickHandler() {
    return () => {
      if (this.isDrawing) {
        const mousePos = this.stage.getPointerPosition();
        const placedObj = this.createShape(mousePos);
        if (placedObj) {
          console.log("STATS:" + placedObj.x(), placedObj.y(), placedObj.width(), placedObj.height());
          placedObj.createShadowObj();
          console.log(
            "SHADOW " + placedObj.shadowObj.x(),
            placedObj.shadowObj.y(),
            placedObj.shadowObj.width(),
            placedObj.shadowObj.height()
          );
          console.log("BLOCK SIZE: " + placedObj.shadowObj.blockSize);
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

  setupGrid() {
    this.gridLayer.destroyChildren();
    let padding = this.blockSize;
    let width = this.container.clientWidth;
    let height = this.container.clientHeight;

    for (let i = 0; i < width / padding; i++) {
      this.gridLayer.add(
        new Konva.Line({
          points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
          stroke: "#ddd",
          strokeWidth: 1,
        })
      );
    }
    for (let j = 0; j < height / padding; j++) {
      this.gridLayer.add(
        new Konva.Line({
          points: [0, Math.round(j * padding), width, Math.round(j * padding)],
          stroke: "#ddd",
          strokeWidth: 0.5,
        })
      );
    }
    this.stage.add(this.gridLayer);
  }

  createHoverObject(type) {
    // mozda hover vo dr layer
    switch (type) {
      case "Entrance":
        return new LineEntrance({ x: 0, y: 0 }, this.blockSize, this.gridLayer);
      case "Room":
        return new RectRoom({ x: 0, y: 0 }, this.blockSize, this.gridLayer);
      case "Wall":
        return new LineWall({ x: 0, y: 0 }, this.blockSize, this.gridLayer);
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
    if (dropdown.options.length === 0) {
      const options = ["Entrance", "Wall", "Room", "Hallway", "Stairs"];
      options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.text = option;
        dropdown.add(optionElement);
      });
    }

    const dropdownContainer = document.getElementById("dropdown");
    dropdownContainer.style.display =
      dropdownContainer.style.display === "none" || dropdownContainer.style.display === "" ? "block" : "none";
  }

  handleSelectionChange() {
    const dropdown = document.getElementById("dropdownOptions");
    const selected = dropdown.value;
    document.getElementById("selectedOption").innerText = `${selected}`;
    this.startDrawing(`${selected}`);
    dropdown.selectedIndex = -1;
  }

  handleDelete(e) {
    if (e.key === "Delete") {
      const selectedNodes = this.tr.nodes();
      selectedNodes.forEach((node) => node.remove());
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
    const selected = shapes.filter((shape) => Konva.Util.haveIntersection(box, shape.getClientRect()));
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

const app = new MapBuilder("container");
