import MapShape from "./MapShape.js";
import Konva from "konva";

export default class MapNode extends MapShape{

    constructor(config, layer, blockSize, snap) {
        if (new.target === MapNode) {
            throw new Error("Cannot instantiate abstract class NodeShape directly.");
        }

        super(config,layer,blockSize,snap);
        this.connectionLines = [];

        this.on("dragmove",() => {
            this.connectionLines.forEach(lineWrapper => {
                console.log("other",lineWrapper.otherShape)
                let updatedPoints = [this.x(),this.y(),lineWrapper.otherShape.x(),lineWrapper.otherShape.y()]
                lineWrapper.line.points(updatedPoints);
            })
        })
    }

    connect(node){
        let line = new Konva.Line({
            points: [this.x(),this.y(),node.x(),node.y()],
            stroke: "rgba(245,37,37,0.85)",
            dash: [2,3],
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'miter',
            opacity: 0.8
        });

        let lineWrapper = {
            line: line,
            otherShape: node
        };

        this.connectionLines.push(lineWrapper);

        let lineWrapperSend = {
            line: line,
            otherShape: this
        };

        node.addLineReference(lineWrapperSend);
        this.layer.add(lineWrapper.line);
    }

    addLineReference(line){
        this.connectionLines.push(line);
    }

    removeConnectionLine(target){
        this.connectionLines.forEach(lineWrapper => {
            if (lineWrapper.otherShape === target){
                lineWrapper.line.remove();
            }
        })

        this.connectionLines = this.connectionLines.filter(lineWrapper => lineWrapper.otherShape !== target);
    }

    destroyShape(graph = null) {
        super.destroyShape();
        this.connectionLines.forEach(lineWrapper => {
            lineWrapper.line.remove()
        });
        if(graph != null){
            this.info.selectedPins.forEach(pinName => {
                graph.removeConnection(this.info.name,pinName)
            })
        }
    }

    load(graph){
        graph.addNode(this);
        console.log("added to graph name: " + this.info.name)
    }


}