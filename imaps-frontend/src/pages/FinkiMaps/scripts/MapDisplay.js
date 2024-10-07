import Konva from "konva";
import { Rect } from "konva/lib/shapes/Rect";
import Wall from "../../Draw/scripts/shapes/Wall";
import RenderedWall from "./shapes/RenderedWall";
import Factory from "../../Draw/scripts/util/Factory";
import HttpService from "../../../Net/HttpService";
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
    this.loaded = false;
    this.mainLayer = new Konva.Layer();
    this.routeLayer = new Konva.Layer();
    this.stage.add(this.mainLayer);
    this.stage.add(this.routeLayer);
    this.route = new Konva.Line();

    this.stage.on("resize", () => {
      this.stage.width = window.innerWidth;
      this.stage.height = window.innerHeight;
    });
  }

  deserializeMap(data) {
    data.forEach((child) => {
      var shape = JSON.parse(child);
      if (shape.className !== "InfoPin") {
        var renderedShape = Factory.createRenderedShape(
          shape.className,
          shape.attrs
        );
        this.shapes.push(renderedShape);
      }
    });
  }

  async loadMap() {
    const httpService = new HttpService();
    const mapData = await httpService.get("/public/mapData");
    this.deserializeMap(mapData);
    this.shapes.forEach((shape) => {
      this.mainLayer.add(shape);
    });
  }

  drawRoute(path) {
    this.routeLayer.removeChildren(); // Clear the layer
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
            const line = new Konva.Arrow({
                points: buff,
                stroke: "#e91332",
                strokeWidth: 2.5,
                dash: [5, 4],
                lineCap: 'round',
                lineJoin: 'round',
                pointerLength: 7,
                pointerWidth: 7,
                fill:'red',
            });

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


  search() {
    console.log("VLEZE VO SEARCH");
  }
}
