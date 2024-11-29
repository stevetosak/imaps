export const queryShapeInfo = (map,type) => {
    return map.shapes.filter(shape => shape.className === type).map(shape => shape.info);
}

export const queryRenderedShapes = (map,type) => {

}

