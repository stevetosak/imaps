import Factory from "../util/Factory.js";
import Konva from "konva";
import HttpService from "../net/HttpService.js";

export class MapBuilder {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.stage = new Konva.Stage({
            container: containerId,
            width: this.container.clientWidth,
            height: this.container.clientHeight,
        });

        // TODO AKO DRAGNIT NEKOJ OD POCETOK NA STAGE POZICIIVE KE SA ZEZNAT
        // TODO jwt vo cookie
        // TODO placed shape i mouseMoveHandler da ne callback ( da ne vrakjat funkcija)

        this.gridLayer = new Konva.Layer();
        this.mainLayer = new Konva.Layer();
        this.dragLayer = new Konva.Layer();
        this.infoPinLayer = new Konva.Layer();
        this.textLayer = new Konva.Layer();
        this.gridLayer.listening(false);

        this.originalWidth = this.container.clientWidth;
        this.originalHeight = this.container.clientHeight;


        this.shapes = [];
        this.blockSize = 10;
        this.efficientDrawingMode = false;
        this.roomTypes = [];

        this.gridLine = new Konva.Line({
            points: [],
            stroke: "grey",
            strokeWidth: 1,
            opacity: 0.3,
        });

        this.gridLine.cache();

        this.mainTransformer = new Konva.Transformer({
            centeredScaling: false,
            rotationSnaps: [0, 90, 180, 270],
            anchorSize: 5,
            padding: 2,
            anchorFill: "#ef7539",
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
            zIndex: 100,
        });

        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;

        this.selecting = false;

        this.initialize();
    }

    initialize() {
        this.drawGrid();
        this.mainLayer.add(this.mainTransformer);
        this.mainLayer.add(this.selectionRectangle);
        this.stage.add(this.gridLayer);
        this.stage.add(this.dragLayer);
        this.stage.add(this.mainLayer);
        this.stage.add(this.infoPinLayer);
        this.stage.add(this.textLayer);
        this.setupEventListeners();
    }

    setupEventListeners() {
        document
            .getElementById("shapeOptions")
            .addEventListener("click", this.selectShape.bind(this));
        document
            .getElementById("render-button")
            .addEventListener("click", this.render.bind(this));
        window.addEventListener("keydown", this.handleExitSelection.bind(this));
        window.addEventListener("keydown", this.handleDelete.bind(this));
        window.addEventListener("resize", this.handleResize.bind(this));
        window.addEventListener("keydown", this.rotateShapesBy90Deg.bind(this));
        window.addEventListener("keydown", this.toggleEfficientDrawingMode.bind(this));
        this.stage.on("mousedown touchstart", this.handleMouseDown.bind(this));
        this.stage.on("mousemove touchmove", this.handleMouseMove.bind(this));
        this.stage.on("mouseup touchend", this.handleMouseUp.bind(this));
        this.stage.on("click tap", this.handleStageClick.bind(this));
        this.stage.on("contextmenu", this.placeInfoPin.bind(this));
        this.stage.on("dragmove", this.dragStage.bind(this));
        this.stage.on("wheel", this.zoomStage.bind(this));
    }

    dragStage(e) {
        if (!e.evt.shiftKey) return;
        this.drawGrid();
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
        this.stage.width(this.container.offsetWidth);
        this.stage.height(this.container.offsetHeight);
        this.drawGrid();
    }

    zoomStage(e) {
        if (!e.evt.shiftKey) return;

        e.evt.preventDefault();

        const scaleFactor = e.evt.deltaY > 0 ? 0.95 : 1.15;

        const prevScale = this.stage.scaleX();

        let newScale = prevScale * scaleFactor;

        const mousePos = this.stage.getRelativePointerPosition();

        let mousePoint = {
            x: (mousePos.x - this.stage.x()) / prevScale,
            y: (mousePos.y - this.stage.y()) / prevScale,
        };

        this.stage.scale({
            x: newScale,
            y: newScale,
        });

        let newStagePos = {
            x: mousePos.x - mousePoint.x * newScale,
            y: mousePos.y - mousePoint.y * newScale,
        };

        this.stage.position(newStagePos);
        this.drawGrid();
        this.stage.batchDraw();
    }


    drawGrid() {
        this.gridLayer.destroyChildren();

        let width = this.stage.width();
        let height = this.stage.height();

        //presmetka od globalen koordinaten sistem vo lokalen na canvasot
        let transform = this.stage.getAbsoluteTransform().copy().invert();
        let topLeft = transform.point({
            x: 0,
            y: 0,
        });

        let bottomRight = transform.point({
            x: width,
            y: height,
        });

        let startX = Math.floor(topLeft.x / this.blockSize) * this.blockSize;
        let startY = Math.floor(topLeft.y / this.blockSize) * this.blockSize;

        let endX = Math.ceil(bottomRight.x / this.blockSize) * this.blockSize;
        let endY = Math.ceil(bottomRight.y / this.blockSize) * this.blockSize;

        for (let x = startX; x <= endX; x += this.blockSize) {
            let line = this.gridLine.clone({
                points: [
                    x + 0.5,
                    topLeft.y - this.blockSize,
                    x + 0.5,
                    bottomRight.y + this.blockSize,
                ],
            });


            line.transformsEnabled("position");
            line.perfectDrawEnabled(false);
            line.shadowForStrokeEnabled(false);

            this.gridLayer.add(line);
        }

        for (let y = startY; y <= endY; y += this.blockSize) {
            let line = this.gridLine.clone({
                points: [
                    topLeft.x - this.blockSize,
                    y + 0.5,
                    bottomRight.x + this.blockSize,
                    y + 0.5,
                ],
            });

            line.perfectDrawEnabled(false);
            line.shadowForStrokeEnabled(false);
            line.transformsEnabled("position");
            this.gridLayer.add(line);
        }

        this.mainLayer.moveToTop();
        this.infoPinLayer.moveToTop();

        this.gridLayer.batchDraw();
    }

    placeInfoPin(e) {
        e.evt.preventDefault();
        let mousePos = this.stage.getRelativePointerPosition();
        let infoPin = Factory.createShape(
            "InfoPin",
            mousePos,
            this.blockSize,
            this.infoPinLayer,
            0
        );
        this.addModalHandling(infoPin);
        this.shapes.push(infoPin);
        this.mainLayer.add(infoPin);
        console.log(infoPin.name());
    }

    toggleEfficientDrawingMode(e) {
        if (e.key === "e" || e.key === "E") {
            this.efficientDrawingMode = !this.efficientDrawingMode;
            console.log("EFFICIENT DRAWING MODE is: ", this.efficientDrawingMode)
        }

        if (!this.efficientDrawingMode) {
            this.stopDrawing();
        }
    }

    placeShape() {
        const mousePos = this.stage.getRelativePointerPosition();
        const placedObj = Factory.createShape(
            this.hoverObj.type,
            mousePos,
            this.blockSize,
            this.mainLayer,
            this.hoverObj.rotation()
        );


        if (!placedObj) return;

        this.mainLayer.add(placedObj);
        this.shapes.push(placedObj);
        placedObj.snapToGrid();
        this.addModalHandling(placedObj)
        this.mainLayer.draw();

        if (!this.efficientDrawingMode) {
            this.stopDrawing();
        }

    }

    stopDrawing() {
        this.mainTransformer.nodes([]);
        this.isDrawing = false;
        this.hoverObj.remove();
        this.dragLayer.removeChildren();
        this.stage.off("mousemove", this.boundMouseMoveHandler);
        this.stage.off("click", this.boundPlaceShapeHandler);

    }

    mouseMoveHandler() {
        const mousePos = this.stage.getRelativePointerPosition();
        this.hoverObj.position({x: mousePos.x, y: mousePos.y});
        this.hoverObj.visible(true);
    }

    startDrawing(shapeType) {
        this.currentShapeType = shapeType;
        this.isDrawing = true;
        let pos = {x: 0, y: 0};
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

        this.boundMouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.boundPlaceShapeHandler = this.placeShape.bind(this);

        this.stage.on("mousemove", this.boundMouseMoveHandler);
        this.stage.on("click", this.boundPlaceShapeHandler);
    }

    selectShape(e) {
        if (e.target.tagName === "LI") {
            const shapeType = e.target.getAttribute("data-info");
            this.startDrawing(shapeType);
            this.mainTransformer.nodes([]);
        }
    }

    addModalHandling(shape) {
        shape.on("dblclick", () => {
            const eventName = shape.modalEventName;
            if (eventName) {
                const data = {
                    room: shape,
                    map: this,
                };
                const event = new CustomEvent(eventName, {detail: data});
                window.dispatchEvent(event);
            }
        })
    }

    rotateShapesBy90Deg(e) {
        if (e.key === "r" || e.key === "R") {
            console.log(this.mainTransformer.nodes())
            this.mainTransformer.nodes().forEach((node) => {
                node.rotate(90);
            });
        }
    }

    handleDelete(e) {
        if (e.key === "Delete") {
            this.mainTransformer.nodes().forEach((node) => {
                node.remove();
                this.shapes.splice(this.shapes.indexOf(node), 1);
            });
            this.mainTransformer.nodes([]);
            this.mainLayer.batchDraw();
        }
    }

    handleExitSelection(e) {
        if (e.key === "Escape") {
            this.mainTransformer.nodes([]);
            this.stopDrawing();
        }
    }


    handleMouseDown(e) {
        this.stage.draggable(e.evt.shiftKey);

        if (e.target !== this.stage) {
            return;
        }

        e.evt.preventDefault();
        this.x1 = this.stage.getRelativePointerPosition().x;
        this.y1 = this.stage.getRelativePointerPosition().y;
        this.x2 = this.stage.getRelativePointerPosition().x;
        this.y2 = this.stage.getRelativePointerPosition().y;

        this.selectionRectangle.width(0);
        this.selectionRectangle.height(0);
        this.selecting = true;
    }

    handleMouseMove(e) {
        if (!this.selecting) {
            return;
        }
        e.evt.preventDefault();
        this.x2 = this.stage.getRelativePointerPosition().x;
        this.y2 = this.stage.getRelativePointerPosition().y;

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
        this.stage.draggable(false);

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

    saveShapeDetails() {
        this.shapes.forEach((room) => {
            room.saveShapeDetails();
            console.log(room.info);
        });
    }

    async render() {
        this.saveShapeDetails();
        const httpService = new HttpService(
            "http://localhost:8080/api/protected",
            true
        );
        try {
            const response = await httpService.post("/render", this.shapes);
            console.log(response);
        } catch (err) {
            console.log("ERROR --> Could not render map --->", err);
        }
    }

    async saveMap(mapName) {
        this.saveShapeDetails();
        const httpService = new HttpService(
            "http://localhost:8080/api/protected/maps",
            true
        );
        try {
            const response = await httpService.put(
                `/save?mapName=${mapName}`,
                this.shapes
            );
            console.log(response, "resp in builder");
        } catch (err) {
            console.log("ERROR --> Could not Save map --->", err);
        }
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
            console.log("Sel 1")
        } else if (metaPressed && isSelected) {
            const nodes = this.mainTransformer.nodes().slice();
            nodes.splice(nodes.indexOf(e.target), 1);
            this.mainTransformer.nodes(nodes);
        } else if (metaPressed && !isSelected) {
            const nodes = this.mainTransformer.nodes().concat([e.target]);
            this.mainTransformer.nodes(nodes);
        }
    }

    addRoomType(roomType) {
        this.roomTypes.push(roomType);
    }

    getRoomTypes() {
        return this.roomTypes;
    }

    getRooms() {
        return this.getShapeInfoByType("Room");
    }

    getPins() {
        return this.getShapeInfoByType("InfoPin");
    }

    getShapeInfoByType(type) {
        return this.shapes
            .filter((shape) => shape.className === type)
            .map((shape) => shape.info);
    }

    updateRoomNames() {
        this.textLayer.removeChildren();
        this.shapes.forEach((shape) => {
            shape.displayName(this.textLayer);
        });
        this.textLayer.children.forEach((child) => console.log(child));
    }

    clearMap() {
        this.mainLayer.removeChildren();
        this.shapes = [];
        this.hoverObj = null;
    }

    deserializeMap(data) {
        console.log("DESERIALIZING: ", data)
        this.clearMap();
        let dsrData = JSON.parse(data);
        dsrData.forEach((child) => {
            const shape = JSON.parse(child);
            const loadedShape = Factory.createShape(
                shape.className,
                {x: shape.attrs.x, y: shape.attrs.y},
                this.blockSize,
                this.mainLayer,
                shape.attrs.rotation
            );
            loadedShape.loadInfo(shape.attrs);
            this.shapes.push(loadedShape);
            this.addModalHandling(loadedShape);
            this.mainLayer.add(loadedShape);
        });
        this.mainTransformer.nodes([])
        this.mainLayer.add(this.mainTransformer);
        this.mainLayer.add(this.selectionRectangle);

    }

}
