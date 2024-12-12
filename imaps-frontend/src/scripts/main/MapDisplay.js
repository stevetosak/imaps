import Konva from "konva";
import Factory from "../util/Factory.js";
import HttpService from "../net/HttpService.js";
import {zoomStage} from "../util/zoomStage.js";
import {addEventHandling} from "../util/addEventHandling.js";
import triggerNavigate from "../util/triggerNavigate.js";
import config from "../net/netconfig.js";

export class MapDisplay {
    constructor(containerId, floorNum) {
        this.container = document.getElementById(containerId);
        this.containerId = containerId;
        this.stage = new Konva.Stage({
            container: containerId,
            width: window.innerWidth,
            height: window.innerHeight,
            draggable: true,
        });

        this.shapes = [];
        this.roomTypes = [];
        this.loaded = false;
        this.mainLayer = new Konva.Layer();
        this.routeLayer = new Konva.Layer();
        this.textLayer = new Konva.Layer();
        this.stage.add(this.mainLayer);
        this.stage.add(this.routeLayer);
        this.stage.add(this.textLayer);

        this.floorNum = floorNum;

        this.navArrow = new Konva.Arrow({
            stroke: "#bb0000",
            strokeWidth: 3,
            dash: [12, 7],
            lineCap: "round",
            tension: 10,
            pointerLength: 2,
            pointerWidth: 3,
        });

        this.navArrow.cache();

        this.stage.on("resize", () => {
            this.stage.width = window.innerWidth;
            this.stage.height = window.innerHeight;
        });

        this.stage.on("wheel", (e) => {
            zoomStage(e, this.stage);
        });
    }

    clearMap() {
        this.mainLayer.removeChildren();
        this.shapes.forEach(shape => shape.clearText())
        this.shapes = [];
    }

    deserializeMap(data) {
        this.clearMap();

        let dsrData = JSON.parse(data);
        dsrData.forEach((shape) => {
            if (shape.className !== "InfoPin") {
                const renderedShape = Factory.createRenderedShape(shape.className, shape.attrs);
                addEventHandling(renderedShape, this, "click");
                this.shapes.push(renderedShape);
            }
        });
    }

    displayRoomNames() {
        this.shapes.forEach((shape) => {
            shape.displayName(this.textLayer);
        });

    }



    loadMapN(floorData) {
        if (floorData == null || floorData === "") return;

        this.deserializeMap(floorData);
        this.shapes.forEach((shape) => {
            this.mainLayer.add(shape);
        });
        this.displayRoomNames();
        this.initializeRoomTypes();

    }

    clearRoute() {
        this.routeLayer.removeChildren();
    }


    drawRouteNEW(nodes, offset = 0) {

        this.clearRoute();
        console.log("====PATH====");
        nodes.forEach((node) => console.log("NODE", node));

        let idx = offset;
        let buff = [nodes[idx].coordinates.x, nodes[idx].coordinates.y];


        ++idx;

        console.log("INIT BUFFER", buff);
        console.log("INIT IDX", idx);

        const drawNextSegment = () => {

            if (idx >= nodes.length){
                return;
            }

            const currentNode = nodes[idx - 1];
            const nextNode = nodes[idx];

            if (nextNode.floorNumber !== currentNode.floorNumber) {
                console.log("VIKNA NAVIGATE");
                triggerNavigate(nodes, idx, nextNode.floorNumber, nextNode);
                return;
            }

            const startX = currentNode.coordinates.x;
            const startY = currentNode.coordinates.y;
            const endX = nextNode.coordinates.x;
            const endY = nextNode.coordinates.y;

            const numSegments = 12;

            const deltaX = (endX - startX) / numSegments;
            const deltaY = (endY - startY) / numSegments;

            const drawSegment = (i) => {
                const segmentX = startX + deltaX * i;
                const segmentY = startY + deltaY * i;

                buff.push(segmentX, segmentY);

                let line = this.navArrow.clone({ points: [...buff] });
                this.routeLayer.add(line);
                this.routeLayer.draw();

                buff = [segmentX, segmentY];
            };

            let segmentIdx = 1;
            const interval = setInterval(() => {
                drawSegment(segmentIdx);
                segmentIdx++;

                if (segmentIdx > numSegments) {
                    clearInterval(interval);
                    idx++;
                    setTimeout(drawNextSegment, 150);
                }
            }, 50);
        };

        drawNextSegment();
    }



    initializeRoomTypes() {
        this.roomTypes = this.shapes
            .filter((shape) => shape.class === "Room" && shape.info.type !== "")
            .map((shape) => shape.info.type);
    }

    getRoomTypes() {
        return this.roomTypes;
    }


    getShapeByName(name){
        return this.shapes.find(shape => shape.info.name === name)
    }

    getShapeByType(type) {
        return this.shapes.filter((shape) => shape.class === type)
    }

    toggleSearchRoom() {
        this.toggleSearch = !this.toggleSearch;
    }

    //ova e loso ne trebit vaka
    highlightShape(roomName) {
        let foundShape = this.shapes.filter((shape) => shape.info.name === roomName)[0];
        foundShape.highlight();
    }

    getMainEntrance() {
        return this.shapes.filter(shape => shape.class === "Entrance").filter(el => el.info.isMainEntrance === true)[0];
    }

    setFilter(filter) {
        let rooms = this.getShapeByType("Room")
        if (filter === "All") {
            rooms.forEach((shape) => {
                shape.unHighlight()
            })
        } else {
            rooms.filter((shape) => shape.info.type === filter).forEach((shape) => {
                shape.highlight()
            })
            rooms.filter((shape) => shape.info.type !== filter).forEach((shape) => {
                shape.unHighlight()
            })
        }

    }
}
