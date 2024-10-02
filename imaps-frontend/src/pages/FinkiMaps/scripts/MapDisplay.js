import Konva from "konva";
import { Rect } from "konva/lib/shapes/Rect";
import Wall from "../../Draw/scripts/shapes/Wall";
import RenderedWall from "./shapes/RenderedWall";
import Factory from "../../Draw/scripts/util/Factory";
export class MapDisplay {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.containerId = containerId;
    this.stage = new Konva.Stage({
      container: containerId,
      width: window.innerWidth,
      height: window.innerHeight,
      draggable : true
    });

    this.shapes = [];
    this.loaded = false;
    this.mainLayer = new Konva.Layer();
    this.stage.add(this.mainLayer);

    this.json = {
      attrs: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      className: "Stage",
      Layer: [
        {
          attrs: {},
          className: "Layer",
          children: [],
        },
      ],
    };

    this.stage.on("resize", () => {
      this.stage.width = window.innerWidth;
      this.stage.height = window.innerHeight;
    });

    window.addEventListener("load", () => {
      const loadResources = async () => {
        const token = localStorage.getItem("token");
        try {
          //if (loaded) return;

          let response = await fetch("http://localhost:8080/api/protected/mapData",
          {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          }
          );
          let data = await response.json();
          this.parseJson(JSON.stringify(data));
          console.log("Load: " + JSON.stringify(data));
          this.loadMap();
          this.loaded = true;
        } catch (error) {
          console.log("error in loading", error);
        }
      };

      loadResources();
    });
  }

  parseJson(json) {
    var data = JSON.parse(json);
    var children = data;

    // refactor trebit na ddraw shapes za da rabotat i tuka ko so trevbit


    // children.forEach(child => {
    //   console.log(child,"kurace");
    // })

    console.log(data,"chcicihchc");
    
    

    

    children.forEach((child) => {
      var shape = JSON.parse(child);
      console.log(shape.className,"geegge");
      if(shape.className !== "InfoPin"){
        var renderedShape = Factory.createRenderedShape(shape.className, shape.attrs);
        this.shapes.push(renderedShape);
      }
     
    });
  }

  loadMap() {
    this.shapes.forEach((shape) => {
      this.mainLayer.add(shape);
    });
  }

  drawRoute(){
    console.log("USPESNO RUTA CRTANJW VLEZE TOP");
    
  }

  search(){
    console.log("VLEZE VO SEARCH");
    
  }
}
