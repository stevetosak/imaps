import Konva from "konva";
import Factory from "../util/Factory.js";
import HttpService from "../net/HttpService.js";
import {zoomStage} from "../util/zoomStage.js";
import {addEventHandling} from "../util/addEventHandling.js";
import triggerNavigate from "../util/triggerNavigate.js";
import config from "../net/netconfig.js";
import {dispatchCustomEvent} from "../util/dispatchCustomEvent.js";
import { jsPDF } from "jspdf";


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


        this.cachedCanvases = [];

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
                console.log("SHAPE ATTRS CREATE: " + JSON.stringify(shape.attrs));
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
                let stageJson = this.stage.toJSON();
                this.cachedCanvases.push(stageJson);
                dispatchCustomEvent("navend",this.downloadURI)
                return;
            }

            const currentNode = nodes[idx - 1];
            const nextNode = nodes[idx];

            if (nextNode.floorNumber !== currentNode.floorNumber) {
                let stageJson = this.stage.toJSON();
                this.cachedCanvases.push(stageJson);
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
                    setTimeout(drawNextSegment, 75);
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

    getShapeByType(type) {
        return this.shapes.filter((shape) => shape.class === type)
    }

    //ova e loso ne trebit vaka
    highlightShape(roomName) {
        let foundShape = this.shapes.filter((shape) => shape.info.name === roomName)[0];
        foundShape.highlight();
    }

     downloadURI(uri, name) {
        let link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // import { jsPDF } from "jspdf";

getRouteImages(mapDetails = {mapName : "mapName", floor : -99, from : "from", to : "to"}) {

    const pdf = new jsPDF("p", "mm", "a4"); // A4 portrait mode
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    let yOffset = margin;
    let stepCounter = 1;

    this.cachedCanvases.forEach((stage, index) => {

        let text = `Step: ${index+1}`
        pdf.text(text, margin, yOffset + 5);

        let parsed = JSON.parse(stage);
        let dsrStage = Konva.Node.create(parsed, document.createElement("div"));


        let canvasImageURI = dsrStage.toDataURL();
        this.downloadURI(canvasImageURI, "t")


        const originalWidth = dsrStage.width();
        const originalHeight = dsrStage.height();


        const maxWidth = pageWidth - 2 * margin;
        const maxHeight = pageHeight - 2 * margin;
        let imgWidth = maxWidth;
        let imgHeight = (originalHeight * maxWidth) / originalWidth;

        if (imgHeight > maxHeight) {
            imgHeight = maxHeight;
            imgWidth = (originalWidth * maxHeight) / originalHeight;
        }


        if (yOffset + imgHeight > pageHeight - margin) {
            pdf.addPage();
            yOffset = margin;
        }


        pdf.addImage(canvasImageURI, "PNG", margin, yOffset, imgWidth, imgHeight);

        yOffset += imgHeight + 10;
    });

    pdf.save(`${mapDetails.mapName}Route.pdf`);
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
