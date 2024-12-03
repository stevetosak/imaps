import MapNode from "../base/MapNode.js";
import ShapeRegistry from "./ShapeRegistry.js";

export default class ShapeQuery{
    static findAllByType(...types) {
        return ShapeRegistry.getShapes().filter(shape => types.includes(shape.className));
    }

    static findNodeByName(shapes, name){
        return shapes.filter(shape => shape instanceof MapNode && shape.info.name === name)[0];
    }
    static findAllByTypeAndFloor(floor,...types){
        return ShapeRegistry.getShapes().filter(shape => types.includes(shape.className) && shape.floorNum === floor);
    }

    static getAllNodes(floor = null){
        return ShapeRegistry.getShapes(floor).filter(shape => shape instanceof MapNode);
    }
}
