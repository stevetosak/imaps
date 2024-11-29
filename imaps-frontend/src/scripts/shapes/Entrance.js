import {_registerNode} from "konva/lib/Global";
import MapNode from "../base/MapNode.js";

export default class Entrance extends MapNode {

    constructor(attrs, id) {

        if (!attrs.fromLoad) {
            attrs.height *= 2;
        }
        super(
            {
                x: attrs.position.x,
                y: attrs.position.y,
                width: attrs.width,
                height: attrs.height,
                fill: "rgba(1,180,46,0.96)",
                stroke: "grey",
                strokeWidth: 1,
                opacity: 0.7,
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
            name: `Entrance ${id}`,
            connectedRoom: "",
            description: "",
            isMainEntrance: false,
            selectedPin: "",
            selectedPins: [],
        };

        this.initText();
        this.moveToTop();
    }

    loadInfo(attrs) {
        this.info.name = attrs.obj_name;
        this.info.connectedRoom = attrs.connected_room;
        this.info.description = attrs.description;
        this.info.isMainEntrance = attrs.is_main_entrance;
        this.info.selectedPins = attrs.connected_pins;
        this.floorNum = attrs.floor_num;
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
}

Entrance.prototype.className = "Entrance";
_registerNode(Entrance);
