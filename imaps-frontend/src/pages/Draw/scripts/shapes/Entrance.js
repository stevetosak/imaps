import Konva from "konva";
import MapShape from "./MapShape";
import { _registerNode } from 'konva/lib/Global';
export default class Entrance extends MapShape {
    constructor(mousePos, blockSize, layer, rotation,snap) {
      super(
        {
          x: mousePos.x,
          y: mousePos.y,
          width: blockSize,
          height: blockSize * 2,
          fill: "#0051ff",
          stroke: "grey",
          strokeWidth: 1,
          opacity: 0.7,
          name: "mapObj",
          draggable: true,
          rotation: rotation,
          zIndex: 1,
        },
        layer,
        blockSize,
        snap
      );
      this.type = "Entrance";
      this.modalEventName = "openEntranceModalEvent";


      this._info = {
        entranceName: '',
        selectedRoom: '',
        description: '',
        isMainEntrance: false
      };
    }

    saveShapeDetails(){
      this.setAttr("room_from",this.info.from);
      this.setAttr("room_to",this.info.to);
      this.setAttr("description",this.info.description)
      this.setAttr("is_main_entrance",this.info.isMainEntrance);
    }
  }

  Entrance.prototype.className = 'Entrance'
_registerNode(Entrance);

