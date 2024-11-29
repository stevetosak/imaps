export default class ShapeQuery{
    static findAll(map,type){
        return map.shapes.filter(shape => shape.className === type);
    }
}
