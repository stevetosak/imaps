import Factory from "./Factory.js";

export default function parseMapData(data,predicate,rendered){
    const dsrData = JSON.parse(data);

    let result = [];

   dsrData.filter(predicate)
       .forEach(s => {
           console.log(s.attrs,"Sattrs pls")
           s.attrs.position = {x: s.attrs.x,y:s.attrs.y}
           const shape = rendered ? Factory.createRenderedShape(s.className,s.attrs) : Factory.createShape(s.className,s.attrs);
           if(!rendered) shape.loadInfo(s.attrs);
           result.push(shape)
       })

    return result;
}