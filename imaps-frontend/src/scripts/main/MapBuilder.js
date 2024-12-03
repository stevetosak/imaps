import Factory from "../util/Factory.js";
import Konva from "konva";
import HttpService from "../net/HttpService.js";
import {zoomStage} from "../util/zoomStage.js";
import {addEventHandling} from "../util/addEventHandling.js";
import MapNode from "../base/MapNode.js";
import {json} from "react-router-dom";
import log from "eslint-plugin-react/lib/util/log.js";
import ShapeRegistry from "../util/ShapeRegistry.js";
import shapeRegistry from "../util/ShapeRegistry.js";
import triggerMapSave from "../util/triggerMapSave.js";

export class MapBuilder {
    constructor(containerId,floorNum,mapName) {
        this.container = document.getElementById(containerId);
        this.stage = new Konva.Stage({
            container: containerId,
            width: this.container.clientWidth,
            height: this.container.clientHeight,
        });

        // TODO AKO DRAGNIT NEKOJ OD POCETOK NA STAGE POZICIIVE KE SA ZEZNAT
        // TODO jwt vo cookie
        // TODO placed shape i mouseMoveHandler da ne callback ( da ne vrakjat funkcija)
        // TODO text na top layer sekogas

        this._floorNum = floorNum;
        this.mapName = mapName;

        this.gridLayer = new Konva.Layer();
        this.mainLayer = new Konva.Layer();
        this.dragLayer = new Konva.Layer();
        this.infoPinLayer = new Konva.Layer();
        this.prioLayer = new Konva.Layer();
        this.textLayer = new Konva.Layer();
        this.gridLayer.listening(false);


        this.othStairs = [];

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
            anchorFill: "#f6031f",
            borderStroke: "black",
            anchorStroke: "black",
            cornerRadius: 20,
            anchorCornerRadius: 10,
            anchorDragBoundFunc: this.transformerSnapFunc(),
        });

        this.selectionRectangle = new Konva.Rect({
            fill: "rgba(56,194,245,0.5)",
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
        document.getElementById("shapeOptions").addEventListener("click", this.selectShape.bind(this));
        window.addEventListener("keydown", this.handleExitSelection.bind(this));
        window.addEventListener("keydown", this.handleDelete.bind(this));
        window.addEventListener("keydown", this.rotateShapesBy90Deg.bind(this));
        window.addEventListener("keydown", this.toggleEfficientDrawingMode.bind(this));
        window.addEventListener("resize", this.handleResize.bind(this));

        this.boundEscapeEventListener = this.handleExitSelection.bind(this);
        this.boundDeleteEventListener = this.handleDelete.bind(this);
        this.boundRotateShapeEventListener = this.rotateShapesBy90Deg.bind(this)
        this.boundEfficientDrawingModeEventListener = this.toggleEfficientDrawingMode.bind(this);

        //this.attachKeyPressEventListeners();

        this.stage.on("mousedown touchstart", this.handleMouseDown.bind(this));
        this.stage.on("mousemove touchmove", this.handleMouseMove.bind(this));
        this.stage.on("mouseup touchend", this.handleMouseUp.bind(this));
        this.stage.on("click tap", this.handleStageClick.bind(this));
        this.stage.on("contextmenu", this.placeInfoPin.bind(this));
        this.stage.on("dragmove", this.dragStage.bind(this));
        this.stage.on("wheel", this.zoom.bind(this));
    }

    detachKeyPressEventListeners() {
        window.removeEventListener("keydown", this.boundEscapeEventListener);
        window.removeEventListener("keydown", this.boundDeleteEventListener);
        window.removeEventListener("keydown", this.boundRotateShapeEventListener);
        window.removeEventListener("keydown", this.boundEfficientDrawingModeEventListener);
    }

    attachKeyPressEventListeners() {
        window.addEventListener("keydown", this.boundEscapeEventListener);
        window.addEventListener("keydown", this.boundDeleteEventListener);
        window.addEventListener("keydown", this.boundRotateShapeEventListener);
        window.addEventListener("keydown", this.boundEfficientDrawingModeEventListener);
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

            const distance = Math.sqrt(Math.pow(newPos.x - oldPos.x, 2) + Math.pow(newPos.y - oldPos.y, 2));

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

    zoom(e) {
        zoomStage(e, this.stage);
        this.drawGrid();
    }

    get floorNum(){
        return this._floorNum;
    }

    set floorNum(val){
        this._floorNum = val;
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
                points: [x + 0.5, topLeft.y - this.blockSize, x + 0.5, bottomRight.y + this.blockSize],
            });

            line.transformsEnabled("position");
            line.perfectDrawEnabled(false);
            line.shadowForStrokeEnabled(false);

            this.gridLayer.add(line);
        }

        for (let y = startY; y <= endY; y += this.blockSize) {
            let line = this.gridLine.clone({
                points: [topLeft.x - this.blockSize, y + 0.5, bottomRight.x + this.blockSize, y + 0.5],
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
        const attrs = {
            type: "InfoPin",
            position: mousePos,
            blockSize: this.blockSize,
            layer: this.mainLayer,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            increment: true,
            floorNum: this.floorNum
        };
        let infoPin = Factory.createShape("InfoPin", attrs);
        addEventHandling(infoPin, this, "dblclick");
        //this.shapes.push(infoPin);
        ShapeRegistry.add(infoPin)
        this.mainLayer.add(infoPin);
        infoPin.displayName(this.textLayer);
        triggerMapSave()

        console.log(infoPin.name());
    }

    toggleEfficientDrawingMode(e) {
        if (e.key === "e" || e.key === "E") {
            this.efficientDrawingMode = !this.efficientDrawingMode;
            console.log("EFFICIENT DRAWING MODE is: ", this.efficientDrawingMode);

            if (!this.efficientDrawingMode) {
                this.stopDrawing();
            }
        }
    }

    placeShape() {
        const mousePos = this.stage.getRelativePointerPosition();
        const attrs = {
            position: mousePos,
            width: this.blockSize,
            height: this.blockSize,
            layer: this.mainLayer,
            rotation: this.hoverObj.rotation(),
            scaleX: 1,
            scaleY: 1,
            increment: true,
            snap: true,
            fromLoad: false,
            blockSize: this.blockSize,
            floorNum: this.floorNum
        };

        const placedObj = Factory.createShape(this.hoverObj.type, attrs);
        if (!placedObj) return;

        console.info("ATTRS FNUM",attrs.floorNum)

        this.mainLayer.add(placedObj);
        //this.shapes.push(placedObj);
        console.log("VO PLACED SHAEPS WALL ZITI SE: " + placedObj.className);
        ShapeRegistry.add(placedObj);
        addEventHandling(placedObj, this, "dblclick");
        this.mainLayer.draw();

        // site ovie func da se vo edna funkcija vo shape.

        placedObj.displayName(this.textLayer);
        placedObj.snapToGrid();

        triggerMapSave();

        if (!this.efficientDrawingMode) {
            this.stopDrawing();
        }
    }

    stopDrawing() {
        this.mainTransformer.nodes([]);
        if (this.hoverObj != null) this.hoverObj.remove();
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
        const attrs = {
            position: {x: 0, y: 0},
            width: this.blockSize,
            height: this.blockSize,
            layer: this.mainLayer,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            increment: false,
            snap: true,
            fromLoad: false,
            blockSize: this.blockSize
        };
        this.hoverObj = Factory.createShape(shapeType, attrs);

        console.log("HOVBER OBK:", this.hoverObj)

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

    rotateShapesBy90Deg(e) {
        if (e.key === "r" || e.key === "R") {
            if (this.hoverObj) {
                this.hoverObj.rotate(90);
            }
            this.mainTransformer.nodes().forEach((node) => {
                node.rotate(90);
            });
        }
    }

    handleDelete(e) {
        if (e.key === "Delete") {
            this.mainTransformer.nodes().forEach((node) => {
                node.remove();
                node.destroy();
                ShapeRegistry.delete(node);
                triggerMapSave();
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
        const selected = shapes.filter((shape) => Konva.Util.haveIntersection(box, shape.getClientRect()));
        this.mainTransformer.nodes(selected);
        console.log(this.mainTransformer.nodes());
    }

    saveShapeDetails() {
        // this.shapes.forEach(shape => {
        //     shape.saveShapeDetails();
        //     console.log(shape.info);
        // });
        ShapeRegistry.saveDetails();
        console.log("thisflornum",this.floorNum)
        return  {
            shapes: ShapeRegistry.getShapes(this.floorNum),
            roomTypes: JSON.stringify(this.roomTypes),
            mapName: this.mapName,
            floorNum: this.floorNum
        }
    }

    getPayload(){
        this.saveShapeDetails();
        return {
            shapes: ShapeRegistry.getShapes(this.floorNum),
            roomTypes: JSON.stringify(this.roomTypes),
            mapName: this.mapName,
            floorNum: this.floorNum
        }
    }

    async saveMap(mapName, username, selectedFloor) {
        this.saveShapeDetails();

        console.log("SHAPSDOASD!!!!!!: " + JSON.stringify(ShapeRegistry.getShapes(this.floorNum)));

        const payload = {
            shapes: ShapeRegistry.getShapes(this.floorNum),
            roomTypes: JSON.stringify(this.roomTypes),
            mapName: mapName,
            floorNum: selectedFloor
        }


        const httpService = new HttpService("http://localhost:8080/api/protected", true);
        try {
            const response = await httpService.put(
                `/my-maps/save?username=${username}`,
                payload
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
            console.log("Sel 1");
        } else if (metaPressed && isSelected) {
            const nodes = this.mainTransformer.nodes().slice();
            nodes.splice(nodes.indexOf(e.target), 1);
            this.mainTransformer.nodes(nodes);
        } else if (metaPressed && !isSelected) {
            const nodes = this.mainTransformer.nodes().concat([e.target]);
            this.mainTransformer.nodes(nodes);
        }
    }

    addRoomType(type) {
        this.roomTypes.push(type);
    }

    removeRoomType(targetType) {
        this.roomTypes = this.roomTypes.filter(type => type !== targetType);
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

    getEntrances() {
        return this.getShapeInfoByType("Entrance");
    }

    //vrakjat info
    getConnections(includeStairs = false) {
        const pins = this.getShapeInfoByType("InfoPin");
        const entrances = this.getShapeInfoByType("Entrance");
        const stairs = this.getShapeInfoByType("Stairs");
        return [...pins, ...entrances];
    }

    //todo ova so info zemanje shapes vo dr klasas

    getShapeInfoByType(type) {
        return ShapeRegistry.getShapes(this.floorNum).filter((shape) => shape.className === type).map((shape) => shape.info);
    }


    drawConnection(node1Name, node2Name) {

        ShapeRegistry.drawConnection(node1Name,node2Name);
    }

    getNodeByName(name) {
        return ShapeRegistry.getShapes(this.floorNum).filter(shape => shape instanceof MapNode && shape.info.name === name)[0];
    }

    removeConnection(from, to) {
        ShapeRegistry.removeConnection(from,to);
    }

    updateRoomNames() {
        this.textLayer.removeChildren();
        ShapeRegistry.getShapes(this.floorNum).forEach((shape) => {
            shape.displayName(this.textLayer);
        });

    }

    isMainEntranceSelected() {
        console.log(this.getEntrances().forEach((en) => console.log(en.isMainEntrance, "asdsad")));

        let hasMainEntrance = false;

        this.getEntrances().forEach((entrance) => {
            if (entrance.isMainEntrance === true) hasMainEntrance = true;
        });

        return hasMainEntrance;

    }

    clearMap() {
        this.mainLayer.removeChildren();
        this.hoverObj = null;
    }


    // ova  klasa i map display da nasledbat od glavna klasa

    loadNewFloor(floor) {

        this._floorNum = floor?.num;
        let data = floor?.mapData;

        if (data == null || data === "") return;

        this.deserializeMap(data);
        shapeRegistry.getShapes(this.floorNum).forEach((shape) => {
            this.mainLayer.add(shape);
        });


    }

    //nov
    deserializeMap(data) {
        console.log("DESERIALIZING: ", data);
        ShapeRegistry.clear(this.floorNum);

        if (data != null) {
            const dsrData = JSON.parse(data);
            //load shapes
            dsrData.forEach((shape) => {
                const attrs = {
                    position: {x: shape.attrs.x, y: shape.attrs.y},
                    width: shape.attrs.width,
                    height: shape.attrs.height,
                    layer: this.mainLayer,
                    blockSize: this.blockSize,
                    rotation: shape.attrs.rotation,
                    scaleX: shape.attrs.scaleX,
                    scaleY: shape.attrs.scaleY,
                    increment: false,
                    snap: true,
                    fromLoad: true,
                    floorNum: this.floorNum
                };

                const loadedShape = Factory.createShape(shape.className, attrs);
                loadedShape.loadInfo(shape.attrs);
                ShapeRegistry.add(loadedShape);
                // na destroy trebit events da sa trgnat
                addEventHandling(loadedShape, this, "dblclick");
            });

            //load room types
            //vo baza trebit da sa cuvaat room types za sekoja mapa

            // let roomTypesParsed = JSON.parse(data.roomTypes);
            // console.log("TYPE OF PARSE " + typeof roomTypesParsed)
            // JSON.parse(roomTypesParsed).forEach(type => {
            //   this.roomTypes.push(type);
            // })
            //
            // console.log("room types arr loaded: " + this.roomTypes)

            // draw connections
            let nodes = ShapeRegistry.getShapes(this.floorNum).filter((shape) => shape.className === "InfoPin" || shape.className === "Entrance" || shape.className === "Stairs");
            nodes.forEach((pin) => {
                let connectedPins = pin.info.selectedPins;
                if (connectedPins) {
                    connectedPins.forEach((slPin) => {
                        console.log("CONN node1: " + pin + "conn node2: " + slPin)
                        this.drawConnection(pin.info.name, slPin);
                    });
                }
            });
        }

        this.mainTransformer.nodes([]);
        this.mainLayer.add(this.mainTransformer);
        this.mainLayer.add(this.selectionRectangle);

        ShapeRegistry.getShapes(this.floorNum).forEach((shape) => shape.displayName(this.textLayer));
    }

}
