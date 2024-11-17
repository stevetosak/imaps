import MapShape from "./MapShape.js";
import Konva from "konva";

export default class MapNode extends MapShape{

    constructor(config, layer, blockSize, snap) {
        if (new.target === MapNode) {
            throw new Error("Cannot instantiate abstract class NodeShape directly.");
        }

        super(config,layer,blockSize,snap);
        this.connectionLines = [];
        this.connectedNodes = [];

        this.connLine = new Konva.Line({
            stroke: "rgba(245,37,37,0.85)",
            dash: [2,3],
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'miter',
            opacity: 0.8
        });

        this.connLine.cache();

        this.on("dragmove",() => {
            this.connectionLines.forEach(lineWrapper => {
                console.log("other",lineWrapper.otherShape)
                let updatedPoints = [this.x(),this.y(),lineWrapper.otherShape.x(),lineWrapper.otherShape.y()]
                lineWrapper.line.points(updatedPoints);
            })
        })
    }

    connect(node){

        const line = this.connLine.clone({
            points: [this.x(),this.y(),node.x(),node.y()]
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
        //this.connectedNodes.push(node);
        this.layer.add(lineWrapper.line);
    }

    addLineReference(line){
        this.connectionLines.push(line);
    }

    removeLineWrapper(target){
        this.connectionLines = this.connectionLines.filter(lineWrapper => lineWrapper.otherShape !== target);
    }


    removeConnectionLine(target){

        this.connectionLines.forEach(lineWrapper => {
            if (lineWrapper.otherShape === target){
                lineWrapper.line.remove();
            }
        })

        target.removeLineWrapper(this);
        this.removeLineWrapper(target);
    }


    destroy() {
        super.destroy();
        this.connectionLines.forEach(lineWrapper => {
            lineWrapper.line.remove()
            lineWrapper.otherShape.removeLineWrapper(this);
        });
    }


}