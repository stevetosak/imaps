export default class ShapeQuery{
    static findAll(shapes,type){
        shapes.forEach(sh => console.log("ShapeQyuery",sh.info))
        let res = shapes.filter(shape => shape.className === type);

        return res;
    }
}
