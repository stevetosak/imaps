import Entrance from "../shapes/Entrance";
import Wall from "../shapes/Wall";
import Room from "../shapes/Room";
import InfoPin from "../shapes/InfoPin";
import Konva from "konva";
import RenderedRoom from "../rendered_shapes/RenderedRoom";
import RenderedEntrance from "../rendered_shapes/RenderedEntrance";
export default class Factory {

  static infoPinCount = 0;
  static wallCount = 0;
  static entranceCount = 0;
  static roomCount = 0;

  static createShape(shapeType, position, blockSize, layer, rotation) {
    console.log(shapeType, "VNATRE VO FACTORY")
    switch (shapeType) {
      case "Entrance":
        return new Entrance(position, blockSize, layer, rotation,true);
      case "Room":
        return new Room(position, blockSize, layer, rotation,true, this.roomCount++);
      case "Wall":
        return new Wall(position, blockSize, layer, rotation,true);
      case "InfoPin":
        return new InfoPin(position, blockSize, layer, false,this.infoPinCount++);
      default:
        throw new Error("Invalid shape type: " + shapeType);
    }
  }

  static createRenderedShape(shapeType,attrs){
    let scaleX = (attrs.scaleX ? parseFloat(attrs.scaleX) : 1);
    let scaleY =  (attrs.scaleY ? parseFloat(attrs.scaleY) : 1);
    switch (shapeType) {
      case "Entrance":
        return new RenderedEntrance(attrs,scaleX,scaleY);
      case "Room":
        return new RenderedRoom(attrs,scaleX,scaleY);
      case "Wall":
        return new Konva.Rect({
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
      default:
        throw new Error("Invalid shape type." + shapeType);
    }
  }
}
