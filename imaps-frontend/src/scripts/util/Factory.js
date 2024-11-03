import Entrance from "../shapes/Entrance";
import Wall from "../shapes/Wall";
import Room from "../shapes/Room";
import InfoPin from "../shapes/InfoPin";
import RenderedRoom from "../rendered_shapes/RenderedRoom";
import RenderedEntrance from "../rendered_shapes/RenderedEntrance";
import RenderedWall from "../rendered_shapes/RenderedWall.js";
export default class Factory {
  // BUG KO KE NAPRES REFRESH SA RESETVAT COUNTS!

  static infoPinCount = 0;
  static wallCount = 0;
  static entranceCount = 0;
  static roomCount = 0;

  static createShape(shapeType,attrs) {
    let scaleX = (attrs.scaleX ? parseFloat(attrs.scaleX) : 1);
    let scaleY =  (attrs.scaleY ? parseFloat(attrs.scaleY) : 1);
    switch (shapeType) {
      case "Entrance":
        if(attrs.increment) this.entranceCount++;
        return new Entrance(attrs,this.entranceCount);
      case "Room":
        if(attrs.increment) this.roomCount++;
        return new Room(attrs,scaleX,scaleY,this.roomCount);
      // case "Wall":
      //   return new Wall(position, blockSize, layer, rotation,true,scaleX,scaleY,true);
      // case "InfoPin":
      //   if(attrs.increment) this.infoPinCount++;
      //   return new InfoPin(position, blockSize, layer, false,this.infoPinCount);
      default:
        throw new Error("Invalid shape type: " + attrs.shapeType);
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
        return new RenderedWall(attrs,scaleX,scaleY);
      default:
        throw new Error("Invalid shape type." + shapeType);
    }
  }
}
