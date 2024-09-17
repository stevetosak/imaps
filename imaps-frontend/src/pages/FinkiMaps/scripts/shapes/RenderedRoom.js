import Konva from "konva";
import RenderedMapShape from "./RenderedMapShape";

export default class RenderedRoom extends Konva.Rect{
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
            cornerRadius:3
        });

        this.roomName = attrs.room_name;
        this.roomType = attrs.room_type;
        this.floor = attrs.floor;
        this.description = attrs.description;
    
        this.on("mouseenter",() => {
        console.log("HOVER ROOM IN", this.x());
        console.log(this.roomName);

        })
        this.on("mouseleave", () => {
            console.log("HOVER ROOM OUT");
        })
    }

   
}