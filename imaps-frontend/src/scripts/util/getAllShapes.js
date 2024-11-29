import parseMapData from "./parseMapData.js";

export default function getAllShapes(floors,rendered,predicate){

    let parsedShapes = [];
    floors.forEach(flr => {
        const parsed = parseMapData(flr.mapData,predicate,rendered)
        parsedShapes = [...parsedShapes,...parsed];
    })
    parsedShapes.forEach(shape => {
        console.info("PARSED Shapes: " + shape.info.name)
    })

    return parsedShapes;
}