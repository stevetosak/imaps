import Konva from "konva";
import Factory from "../util/Factory.js";
import HttpService from "../net/HttpService.js";
import {zoomStage} from "../util/zoomStage.js";
import {json} from "react-router-dom";
import error from "eslint-plugin-react/lib/util/error.js";
import {addEventHandling} from "../util/addEventHandling.js";

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

        this.selectedRoom = {
            id: 1,
            name: "223",
            type: "Laboratory",
            image:
                "data:image/jpeg;base64,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",
            description: "223 is a laboratory with a capacity of 40 people",
        };
        this.toggleSearch = false;

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

    clearMap() {
        this.mainLayer.removeChildren();
        this.shapes.forEach(shape => shape.clearText())
        this.shapes = [];
    }

    deserializeMap(data) {
        this.clearMap();

        let dsrData = JSON.parse(data.jsonData);
        dsrData.forEach((child) => {
            const shape = JSON.parse(child);
            if (shape.className !== "InfoPin") {
                const renderedShape = Factory.createRenderedShape(shape.className, shape.attrs);
                addEventHandling(renderedShape,this,"click");
                this.shapes.push(renderedShape);
                console.log(renderedShape)
            }

        });
    }

    displayRoomNames() {
        this.shapes.forEach((shape) => {
            shape.displayName(this.textLayer);
        });

    }

    async loadMap(mapName,floorNum,username,isPrivate) {
        const httpService = new HttpService();
        floorNum = floorNum == null ? 0 : floorNum;
        let resp;
        try{
            if(!isPrivate){
                resp = await httpService.get(`/public/map-data?mapName=${mapName}&floorNum=${floorNum}`);
            }
            else {
                httpService.setAuthenticated();
                resp = await httpService.get(`/protected/map-data?mapName=${mapName}&floorNum=${floorNum}&username=${username}`);
            }

            console.log(resp,"rsp view");
            if(resp.mapData != null){
                this.deserializeMap(resp.mapData);
                this.shapes.forEach((shape) => {
                    this.mainLayer.add(shape);
                });
                this.displayRoomNames();
                this.initializeRoomTypes();
            }

        }catch(e){
            throw new Error("Cant load map: " +  e)
        }
    }

    async loadFloor(floorNum){

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

    setSelectedRoom(room){
        this.selectedRoom = room;
    }

    toggleSearchRoom() {
        this.toggleSearch = !this.toggleSearch;
    }
}
