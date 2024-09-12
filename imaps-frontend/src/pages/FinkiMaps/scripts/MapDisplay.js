import Konva from "konva";
import { Rect } from "konva/lib/shapes/Rect";
export class MapDisplay{
    constructor(containerId){
         this.container = document.getElementById(containerId);
         this.containerId = containerId;
        // this.stage = new Konva.Stage({
        //   container: containerId,
        //   width: this.container.clientWidth,
        //   height: this.container.clientHeight,
        // });
        this.mainLayer = new Konva.Layer();
        //this.stage.add(this.mainLayer);

        this.json = {
            attrs: {
              width: this.container.clientWidth,
              height: 1800

            },
            className: "Stage",
            Layer: [
              {
                attrs: {},
                className: "Layer",
                children: []
              }
            ]
          };

          window.addEventListener('load',() => {
            const loadResources = async () => {
              try{
                let response = await fetch("http://localhost:8080/api/mapData");
                let data = await response.json();
                console.log("Load: " + JSON.stringify(data));
              } catch (error){
                console.log("error in loading");
              }

            }

            loadResources();
          })
    }
    addShape(){
        this.mainLayer.add(new Rect({
            x: 200,
            y: 200,
            width: 220,
            height: 200,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 2,
        }));  
    }

    loadMap(){
        // this.stage = Konva.Node.create(this.json,this.containerId);
        // this.stage.add(this.mainLayer);
        // this.addShape();
    }
}