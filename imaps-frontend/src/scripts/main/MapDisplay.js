import Konva from "konva";
import Factory from "../util/Factory.js";
import HttpService from "../net/HttpService.js";
import {zoomStage} from "../util/zoomStage.js";
import {json} from "react-router-dom";
import error from "eslint-plugin-react/lib/util/error.js";
import {addEventHandling} from "../util/addEventHandling.js";
import log from "eslint-plugin-react/lib/util/log.js";

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
            stroke: "#DC143C",
            strokeWidth: 3,
            dash: [10, 7],
            lineCap: "round",
            pointerLength: 4,
            pointerWidth: 3,
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

        let dsrData = JSON.parse(data);
        dsrData.forEach((shape) => {
            if (shape.className !== "InfoPin") {
                const renderedShape = Factory.createRenderedShape(shape.className, shape.attrs);
                addEventHandling(renderedShape,this,"click");
                this.shapes.push(renderedShape);
            }
        });
    }

    displayRoomNames() {
        this.shapes.forEach((shape) => {
            shape.displayName(this.textLayer);
        });

    }

    // ne se koristit ova pojke
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

    loadMapN(floorData){
        if(floorData != null){
            this.deserializeMap(floorData);
            this.shapes.forEach((shape) => {
                this.mainLayer.add(shape);
            });
            this.displayRoomNames();
            this.initializeRoomTypes();
        }
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
    getShapeByType(type) {
        return this.shapes.filter((shape) => shape.class === type)
    }

    toggleSearchRoom() {
        this.toggleSearch = !this.toggleSearch;
    }

    findRoomByName(roomName){
        let foundShape = this.shapes.filter((shape) => shape.info.name === roomName)[0];
        console.log(foundShape,"111111111111111")
        foundShape.highlight();
        return foundShape;
    }

    getMainEntrance(){
        return this.shapes.filter(shape => shape.class === "Entrance").filter(el => el.info.isMainEntrance === true)[0];
    }

    setFilter(filter){
        let rooms = this.getShapeByType("Room")
        if(filter === "All"){
            rooms.forEach((shape) => {shape.unHighlight()})
        }
        else {
            rooms.filter((shape) => shape.info.type === "").forEach((shape) => {
                shape.highlight()
            })
            rooms.filter((shape) => shape.info.type !== "").forEach((shape) => {
                shape.unHighlight()
            })
        }

    }
}
