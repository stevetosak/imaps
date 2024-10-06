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
    this.routeLayer.removeChildren();
    console.log("====PATH====");
    path.forEach((point) => console.log(point.x, point.y));

    const pointsArray = path.flatMap((point) => [point.x, point.y]);

    const route = new Konva.Line({
      points: pointsArray,
      stroke: "red",
      strokeWidth: 3,
    });

    this.routeLayer.add(route);
  }

  search() {
    console.log("VLEZE VO SEARCH");
  }
}
