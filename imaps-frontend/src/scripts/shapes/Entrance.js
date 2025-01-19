import {_registerNode} from "konva/lib/Global";
import MapNode from "../base/MapNode.js";
import {node} from "prop-types";
import ShapeRegistry from "../util/ShapeRegistry.js";
import ShapeQuery from "../util/ShapeQuery.js";
import Konva from "konva";

export default class Entrance extends MapNode {

    constructor(attrs, id) {

        if (!attrs.fromLoad) {
            attrs.height *= 2;
        }
        super(
            {
                x: attrs.position.x,
                y: attrs.position.y,
                width: attrs.width * attrs.scaleX,
                height: attrs.height * attrs.scaleY,
                fill: "rgb(126,238,167)",
                stroke: "#252627",
                strokeWidth: 1,
                opacity: 0.9,
                name: "mapObj",
                draggable: true,
                rotation: attrs.rotation,
                zIndex: 1,
            },
            attrs.layer,
            attrs.blockSize,
            attrs.snap
        );
        this.type = "Entrance";
        this.eventName = "openEntranceModalEvent";
        this.floorNum = attrs.floorNum

        this.id = id;

        this._info = {
            name: `Entrance${id} [${this.floorNum}F]`,
            connectedRoom: "",
            description: "",
            isMainEntrance: false,
            selectedPin: "",
            selectedPins: [],
        };

        this.initText();
        this.moveToTop();

        console.log("room CONNECT: " + attrs.connected_room,this.info.connectedRoom + "CON")
        console.log("entrance: " + this.info.name)
    }

    loadInfo(attrs) {
        this.info.name = attrs.obj_name ?? `Entrance${this.id} [${this.floorNum}F]`;
        this.info.connectedRoom = attrs.connected_room ?? ``;
        this.info.description = attrs.description ?? ``;
        this.info.isMainEntrance = attrs.is_main_entrance ?? false;
        this.info.selectedPins = attrs.connected_pins ?? [];
    }


    saveShapeDetails() {
        console.info("fnum entrance",this.attrs.floorNum)
        this.setAttr("connected_pins", this.info.selectedPins);
        this.setAttr("obj_name", this.info.name);
        this.setAttr("description", this.info.description);
        this.setAttr("is_main_entrance", this.info.isMainEntrance);
        this.setAttr("connected_room", this.info.connectedRoom);
        this.setAttr("floor_num",this.floorNum);
    }

    connect(node, draw = true) {
        if(this.floorNum !== node.floorNum) return;

        super.connect(node)
    }

    setInfo(infoObj) {
        this.info = infoObj;
        this.setHighlight();
    }

    setHighlight(){
        console.log("info room: " + this.info.connectedRoom)
        if(this.info.connectedRoom == null || this.info.connectedRoom === "" ){
            console.log("vleze if")
            this.strokeWidth(2);
            this.stroke("#8a000d")
        }else{
            this.strokeWidth(1)
            this.stroke("black")
        }
    }

    onPlace() {
        ShapeQuery
            .findAllByTypeAndFloor(this.floorNum,"Room")
            .forEach(room => {
                if(Konva.Util.haveIntersection(room.getClientRect(),this.getClientRect())){
                    this.info.connectedRoom = room.info.name;
                }
            })
        this.setHighlight()
    }
}

Entrance.prototype.className = "Entrance";
_registerNode(Entrance);
