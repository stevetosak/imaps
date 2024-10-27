import RenderedMapShape from "./RenderedMapShape.js";
import {_registerNode} from "konva/lib/Global";

export default class RenderedWall extends RenderedMapShape{
    constructor(attrs,scaleX,scaleY){
        super({
            x: attrs.x,
            y: attrs.y,
            width: attrs.width * scaleX,
            height: attrs.height * scaleY,
            fill: 'grey',
            stroke: 'black',
            strokeWidth: 1,
            draggable: false,
            rotation: attrs.rotation,
            cornerRadius:3
        });

    }
}

RenderedWall.prototype.className = "RenderedWall";
_registerNode(RenderedWall);