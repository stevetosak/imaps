import Entrance from "../shapes/Entrance";
import Wall from "../shapes/Wall";
import Room from "../shapes/Room";
import InfoPin from "../shapes/InfoPin";
import RenderedRoom from "../rendered_shapes/RenderedRoom";
import RenderedEntrance from "../rendered_shapes/RenderedEntrance";
import RenderedWall from "../rendered_shapes/RenderedWall.js";
import Stairs from "../shapes/Stairs.js";
import RenderedStairs from "../rendered_shapes/RenderedStairs.js";
import {updateShapeCount, getShapeCount} from "./ShapeCount.js";
export default class Factory {
  // BUG KO KE NAPRES REFRESH SA RESETVAT COUNTS!

  static createShape(shapeType,attrs) {
    console.log(attrs,"attrs in factory")
    console.log("position in factory: " + attrs.position.x)

    let scaleX = (attrs.scaleX ? parseFloat(attrs.scaleX) : 1);
    let scaleY =  (attrs.scaleY ? parseFloat(attrs.scaleY) : 1);

    attrs.scaleX = scaleX;
    attrs.scaleY = scaleY;

    switch (shapeType) {
      case "Entrance":
        if(attrs.increment) updateShapeCount("entrance")
        return new Entrance(attrs,getShapeCount("entrance"));
      case "Room":
        if(attrs.increment) updateShapeCount("room");
        return new Room(attrs,getShapeCount("room"));
       case "Wall":
         return new Wall(attrs);
       case "InfoPin":
        if(attrs.increment) updateShapeCount("infoPin")
          return new InfoPin(attrs,getShapeCount("infoPin"));
      case "Stairs":
        if(attrs.increment) updateShapeCount("stairs")
        return new Stairs(attrs,getShapeCount("stairs"))
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
        return new RenderedWall(attrs,scaleX,scaleY);
      case "Stairs":
        return new RenderedStairs(attrs,scaleX,scaleY)
      default:
        throw new Error("Invalid shape type." + shapeType);
    }
  }
}
