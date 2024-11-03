import Konva from "konva";
import Factory from "../util/Factory.js";
import HttpService from "../net/HttpService.js";
import {zoomStage} from "../util/zoomStage.js";
import {json} from "react-router-dom";

export class MapDisplay {
    constructor(containerId) {
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
        this.navArrow = new Konva.Arrow({
            stroke: "#e91332",
            strokeWidth: 2.5,
            dash: [5, 4],
            lineCap: "round",
            lineJoin: "round",
            pointerLength: 7,
            pointerWidth: 7,
            fill: "red",
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

    deserializeMap(data) {

        let dsrData = JSON.parse(data.jsonData);
        dsrData.forEach((child) => {
            const shape = JSON.parse(child);
            if (shape.className !== "InfoPin") {
                const renderedShape = Factory.createRenderedShape(shape.className, shape.attrs);
                this.shapes.push(renderedShape);
            }
        });
    }

    displayRoomNames() {
        console.log("VLEZE");
        this.shapes.forEach((shape) => {
            shape.displayName(this.textLayer);
        });

        this.textLayer.children.forEach((child) => console.log(child, "DECAAA"));
    }

    async loadMap(mapName,isPrivate) {
        const httpService = new HttpService();
        let resp;
        if(!isPrivate){
             resp = await httpService.get(`/public/map-data?mapName=${mapName}&floorNum=0`);
        }
        else {
          httpService.setAuthenticated();
          resp = await httpService.get(`/protected/map-data?mapName=${mapName}`)

        }

        console.log(resp);

        this.deserializeMap(resp.mapData);
        this.shapes.forEach((shape) => {
            this.mainLayer.add(shape);
        });
        this.displayRoomNames();
        this.initializeRoomTypes();

    }

    drawRoute(path) {
        this.routeLayer.removeChildren();
        console.log("====PATH====");
        path.forEach((point) => console.log(point.x, point.y));

        const pointsArray = path.flatMap((point) => [point.x, point.y]);

        console.log(pointsArray, "POINTS");

        let buff = [];
        let count = 0;
        let index = 0;

        const drawNextSegment = () => {
            if (index >= pointsArray.length) return;

            buff.push(pointsArray[index]);
            count++;

            if (count % 4 === 0) {
                // const line = new Konva.Arrow({
                //   points: buff,
                //   stroke: "#e91332",
                //   strokeWidth: 2.5,
                //   dash: [5, 4],
                //   lineCap: "round",
                //   lineJoin: "round",
                //   pointerLength: 7,
                //   pointerWidth: 7,
                //   fill: "red",
                // });

                let line = this.navArrow.clone({
                    points: buff
                })

                this.routeLayer.add(line);
                this.routeLayer.draw();

                console.log(buff, "BUFFER");
                buff = [];
                index -= 2;
            }

            index++;

            setTimeout(drawNextSegment, 25);
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

    getRooms() {
        return this.getShapeInfoByType("Room");
    }

    getPins() {
        return this.getShapeInfoByType("InfoPin");
    }

    getEntrances() {
        return this.getShapeInfoByType("Entrance");
    }

    getShapeInfoByType(type) {
        return this.shapes.filter((shape) => shape.class === type).map((shape) => shape.info.name);
    }

    search() {
        console.log("VLEZE VO SEARCH");
    }
}
