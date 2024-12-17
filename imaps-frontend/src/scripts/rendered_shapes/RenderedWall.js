import RenderedMapShape from "../base/RenderedMapShape.js";
import {_registerNode} from "konva/lib/Global";

export default class RenderedWall extends RenderedMapShape{
    constructor(attrs,scaleX,scaleY){
        super({
            x: attrs.x,
            y: attrs.y,
            width: attrs.width,
            height: attrs.height,
            fill: '#4B4B4B',
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