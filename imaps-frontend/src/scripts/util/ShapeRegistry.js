import MapNode from "../base/MapNode.js";
import ShapeQuery from "./ShapeQuery.js";


class ShapeRegistry {
    constructor() {
        if (!ShapeRegistry.instance) {
            this.store = {
                floors: {}
            };
            ShapeRegistry.instance = this;
        }

        return ShapeRegistry.instance;
    }

    /**
     * @description Get all the shapes from a floor if floorNumber is specified.
     * @description If floorNumber is not specified, returns all the shapes from every floor.
     * @param floorNumber
     * @returns {[{}]} [shapes]
     */
    getShapes(floorNumber = null) {
        if (!this.store.floors[floorNumber]) {
            this.store.floors[floorNumber] = [];
        }

        if (floorNumber != null) {
            return this.store.floors[floorNumber];
        } else {
            return Object.values(this.store.floors).flat();
        }


    }

    /**
     * Adds a shape to a floor that corresponds the shape's internally stored floor number.
     * @param shape
     */
    add(shape) {
        console.log("floor: " + shape.floorNum)
        if (!this.store.floors[shape.floorNum]) {
            this.store.floors[shape.floorNum] = [];
        }
        this.store.floors[shape.floorNum].push(shape);
    }

    /**
     * Deletes a shape from the floor corresponds the shape's internally stored floor number
     * @param shape
     */
    delete(shape) {
        const floorShapes = this.store.floors[shape.floorNum];
        if (floorShapes) {
            const index = floorShapes.indexOf(shape);
            if (index !== -1) {
                floorShapes.splice(index, 1);
            }
        }
    }

    /**
     * @param floorNumber Clears all shapes from the specified floor
     */
    clear(floorNumber = null) {

        if(floorNumber != null){
            const floor = this.store.floors[floorNumber];
            if (Array.isArray(floor)) {
                floor.forEach(shape => shape.destroy());
                this.store.floors[floorNumber] = [];
            }
        } else {
           Object.keys(this.store.floors).forEach(floorNumber => {
               const floor =  this.store.floors[floorNumber];
               if (Array.isArray(floor)) {
                   floor.forEach(shape => shape.destroy());
                   this.store.floors[floorNumber] = [];
               }
           })
        }



    }

    // ova mozit optimizacija da ne pret na site spratoj update celo vreme, samo ko ke povrzvis stairs da pret na site
    updateConnections() {
        Object.values(this.store.floors).forEach(floorShapes => {
            floorShapes.forEach(shape => {
                if (shape.className === "InfoPin" || shape.className === "Entrance" || shape.className === "Stairs") {
                    shape.info.selectedPins.forEach((connectedShapeName) => {
                        const connectedShape = floorShapes.find(s => s.info.name === connectedShapeName);
                        if (
                            connectedShape &&
                            (connectedShape.className === "InfoPin" || connectedShape.className === "Entrance" || connectedShape.className === "Stairs")
                        ) {
                            if (!connectedShape.info.selectedPins.includes(shape.info.name)) {
                                connectedShape.info.selectedPins.push(shape.info.name);
                            }
                        }
                    });
                }
            });
        });
    }

    drawConnection(node1Name, node2Name) {
        const node1 = Object.values(this.store.floors).flat().find(shape => shape instanceof MapNode && shape.info.name === node1Name);
        const node2 = Object.values(this.store.floors).flat().find(shape => shape instanceof MapNode && shape.info.name === node2Name);

        if (node1 && node2) {
            node1.connect(node2);
        }
    }

    removeConnection(from, to) {
        let shapes = Object.values(this.store.floors).flat();

        let node1 = ShapeQuery.findNodeByName(shapes, from);
        let node2 = ShapeQuery.findNodeByName(shapes, to);

        node1.removeConnectionLine(node2);

        Object.values(this.store.floors).flat().filter(s => s.info.name === from || s.info.name === to)
            .forEach(s => {
                s.info.selectedPins = s.info.selectedPins.filter(pin => pin !== from && pin !== to);
            });
        console.log("Remove");
    }

    saveDetails() {
        Object.values(this.store.floors).flat().forEach(shape => {
            shape.saveShapeDetails();
            console.log(shape.info);
        });
    }
}

/**
 * A singleton instance that holds all the shapes for all the floors in the map builder.
 * Every operation of adding, removing or updating drawn shapes should reference this instance.
 */
const instance = new ShapeRegistry();
Object.freeze(instance);

export default instance;
