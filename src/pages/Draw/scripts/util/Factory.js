import Konva from "konva";
import Entrance from "../shapes/Entrance";
import Wall from "../shapes/Wall";
import Room from "../shapes/Room";
import InfoPin from "../shapes/InfoPin";
export default class Factory {
  static count = 0;
  static createShape(shapeType, position, blockSize, layer, rotation) {
    switch (shapeType) {
      case "Entrance":
        return new Entrance(position, blockSize, layer, rotation,true);
      case "Room":
        return new Room(position, blockSize, layer, rotation,true);
      case "Wall":
        return new Wall(position, blockSize, layer, rotation,true);
      case "InfoPin":
        return new InfoPin(position, blockSize, layer, false,this.count++);
      default:
        throw new Error("Invalid shape type.");
    }
  }
}
