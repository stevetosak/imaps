import MapNode from "../base/MapNode.js";

export default class ShapeQuery{
    static findAllByType(shapes, type){
        shapes.forEach(sh => console.log("ShapeQyuery",sh.info))
        return shapes.filter(shape => shape.className === type);
    }
    static findNodeByName(shapes, name){
        return shapes.filter(shape => shape instanceof MapNode && shape.info.name === name)[0];
    }
}
