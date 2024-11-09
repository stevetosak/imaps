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
            stroke: "#f80d38",
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

    destroyShape(graph = null) {
        super.destroyShape();
        this.connectionLines.forEach(lineWrapper => lineWrapper.line.remove());
        if(graph != null){
            this.info.selectedPins.forEach(pinName => {
                graph.removeConnection(this.info.name,pinName)
            })
        }
    }


}