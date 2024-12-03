import Konva from "konva";
import MapNode from "../base/MapNode.js";
import {_registerNode} from "konva/lib/Global.js";
import Room from "./Room.js";
export default class Stairs extends MapNode{
    constructor(attrs,id) {

        if(!attrs.fromLoad){
            attrs.width *= 4;
        }

        super({
                x: attrs.position.x,
                y: attrs.position.y,
                width: attrs.width * attrs.scaleX,
                height: attrs.height * attrs.scaleY,
                fill: "rgb(199,190,133)",
                stroke: "rgb(16,15,15)",
                strokeWidth: 1,
                name: "mapObj",
                rotation: attrs.rotation,
                draggable: true
            },
            attrs.layer,
            attrs.blockSize,
            attrs.snap
        );

        this.floorNum = attrs.floorNum;

        this.type = "Stairs"
        this._info = {
            name: `Stairs${id} [${this.floorNum}F]`,
            description: "",
            selectedPins: []
        };




        this.id = id;
        this.eventName = "openStairsModalEvent";
        this.initText();
    }


    _sceneFunc(context, shape) {
        const { width, height} = this.attrs;

        let steps = 5;
        context.beginPath()
        for(let i = 0; i < steps; i++){
            context.rect((-this.blockSize) * i,(this.blockSize * 0.6) * i,width * 0.86,height/2)
            context.fillStrokeShape(shape);
        }
        context.closePath()
    }

    loadInfo(attrs) {
        this.info.name = attrs.obj_name;
        this.info.description = attrs.description;
        this.info.selectedPins = attrs.connected_pins;
        this.floorNum = attrs.floor_num;
    }

    saveShapeDetails() {
        this.setAttr("connected_pins", this.info.selectedPins);
        this.setAttr("obj_name", this.info.name);
        this.setAttr("description", this.info.description);
        this.setAttr("floor_num",this.floorNum)
    }
    connect(node) {
        const draw = this.floorNum === node.floorNum;
        super.connect(node,draw);
    }
}

Stairs.prototype.className = "Stairs";
_registerNode(Stairs);
//TODO