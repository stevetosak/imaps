import Konva from "konva";
import RenderedMapShape from "./RenderedMapShape";

export default class RenderedRoom extends Konva.Rect{
    constructor(attrs){
        super({
            x: attrs.x,
            y: attrs.y,
            width: attrs.width,
            height: attrs.height,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            draggable: false,
            rotation: attrs.rotation,
            cornerRadius:3
        });
    
        this.on("mouseenter",() => {
        console.log("HOVER ROOM IN", this.x());
        })
        this.on("mouseleave", () => {
            console.log("HOVER ROOM OUT");
        })
    }

   
}