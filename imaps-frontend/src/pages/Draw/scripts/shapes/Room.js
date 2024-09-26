import Konva from "konva";
import MapShape from "./MapShape";
import { _registerNode } from 'konva/lib/Global';
export default class Room extends MapShape {
    constructor(mousePos,blockSize,layer,rotation,snap,id) {
      super(
        {
          x: mousePos.x,
          y: mousePos.y,
          width: blockSize * 8,
          height: blockSize * 4,
          fill: "#DDE0F8",
          stroke: "grey",
          strokeWidth: 1,
          name: "mapObj",
          rotation: rotation,
          draggable: true,
        },
        layer,
        blockSize,
        snap
      );
  
      this.type = "Room";
      this.modalEventName = "openRoomModalEvent"

      this._info = {
        name: '',
        type: '',
        description: ''
      }

    }


    saveShapeDetails(){
      this.setAttr("room_name",this.info.name);
      this.setAttr("room_type",this.info.type);
      this.setAttr("floor",this.info.floor)
      this.setAttr("description",this.info.description);
    }
   
  }

  Room.prototype.className = 'Room'
  _registerNode(Room);