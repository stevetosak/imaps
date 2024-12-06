import Factory from "./Factory.js";
import shapeRegistry from "./ShapeRegistry.js";

export default function parseMapData(data, predicate, rendered) {
    if (data == null || data === "") return [];
    const dsrData = JSON.parse(data);

    console.log("VLEZE use")

    let result = [];

    dsrData.filter(predicate)
        .forEach(s => {
            console.log(s.attrs, "Sattrs pls")
            s.attrs.position = {x: s.attrs.x, y: s.attrs.y}
            const shape = rendered ? Factory.createRenderedShape(s.className, s.attrs) : Factory.createShape(s.className, s.attrs);

            if (!rendered) {
                shape.loadInfo(s.attrs);
                shapeRegistry.add(shape)
            }

            result.push(shape)

        })

    return result;
}