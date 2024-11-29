import Factory from "./Factory.js";

export default function parseMapData(data,predicate){
    const dsrData = JSON.parse(data);

    let result = [];

    dsrData.filter(predicate)
        .forEach(s => {
            const shape = Factory.createRenderedShape(s.className,s.attrs)
            result.push(shape)
        })

    return result;
}