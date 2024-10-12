import Konva from "konva";
import RenderedMapShape from "./RenderedMapShape.js";

export default class RenderedRoom extends RenderedMapShape{
    constructor(attrs,scaleX,scaleY){
        super({
            x: attrs.x,
            y: attrs.y,
            width: attrs.width * scaleX,
            height: attrs.height * scaleY,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            draggable: false,
            rotation: attrs.rotation,
            cornerRadius:3,
            zIndex: 0
        });

        this.info.name = attrs.obj_name;
        this.info.description = attrs.description;
        
    
        this.on("mouseenter",() => {
        console.log("HOVER ROOM IN", this.x());
        console.log(this.info.name,"NAME");
        this.opacity(0.7);
        this.fill("pink");
        })
        this.on("mouseleave", () => {
            console.log("HOVER ROOM OUT");
            this.opacity(1);
            this.fill("white");
        })

        this.initText()
    }

   
}