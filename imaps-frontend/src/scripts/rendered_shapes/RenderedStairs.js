import RenderedMapShape from "../base/RenderedMapShape.js";
import Stairs from "../shapes/Stairs.js";
import {_registerNode} from "konva/lib/Global";
import Konva from "konva";
export default class RenderedStairs extends RenderedMapShape{
    constructor(attrs,scaleX,scaleY) {
        super({
            x: attrs.x,
            y: attrs.y,
            width: attrs.width * scaleX,
            height: attrs.height * scaleY,
            fill: "rgb(199,190,133)",
            stroke: "rgb(16,15,15)",
            strokeWidth: 1,
            name: "mapObj",
            rotation: attrs.rotation,
        });
    }



    _sceneFunc(context, shape) {
        const { width, height} = this.attrs;

        let steps = 5;
        let offset = 10;
        context.beginPath()
        for(let i = 0; i < steps; i++){
            context.rect((-offset) * i,(offset * 0.6) * i,width * 0.86,height/2)
            context.fillStrokeShape(shape);
        }
        context.closePath()
    }
}

RenderedStairs.prototype.className = "RenderedStairs";
_registerNode(RenderedStairs);
