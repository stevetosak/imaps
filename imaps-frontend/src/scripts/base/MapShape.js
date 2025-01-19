import Konva from "konva";

export default class MapShape extends Konva.Shape {
    constructor(config, layer, blockSize, snap) {
        if (new.target === MapShape) {
            throw new Error("Cannot instantiate abstract class BaseShape directly.");
        }

        super(config);
        this.layer = layer;
        this.blockSize = blockSize;
        this._type = "";
        this.snappable = snap;
        this._info = {};
        this.eventName = "";
        this.infoText = null;
        this.floorNum;

        this.shadowForStrokeEnabled(false);
        this.on("mouseover", () => (document.body.style.cursor = "pointer"));
        this.on("mouseout", () => (document.body.style.cursor = "default"));
        this.on("click", (e) => {
            if(e.evt.altKey){
                this.moveToTop();
                this.getLayer()
                    .find("Transformer")
                    .forEach((t) => t.moveToTop());
            }

        });

        if (snap) {
            this.on("dragend", this.snapToGrid.bind(this));
            this.on('dblclick', this.snapToGrid.bind(this));
        }

        this.on("transform", () => {
            const scaleX = this.scaleX();
            const scaleY = this.scaleY();
            this.strokeWidth(1 / Math.max(scaleX, scaleY));
        });


        this.on('dragmove', () => {
            if (this.infoText) {
                this.updateTextPosition();
            }
        });

    }

    loadInfo(attrs) {
        console.log("Abstract function");
    }


    initText() {
        this.textOffsetX = 0;
        this.textOffsetY = -30;
        this.infoText = new Konva.Text({
            x: this.x() + this.textOffsetX,
            y: this.y() + this.textOffsetY,
            text: this._info.name,
            fontSize: 12,
            fontFamily: 'Exo',
            fill: 'white',
        });
    }

    updateTextPosition() {
        if (this.infoText) {
            this.infoText.x(this.x() + this.textOffsetX);
            this.infoText.y(this.y() + this.textOffsetY);
        }
    }

    displayName(layer) {
        if (this.infoText) {
            this.infoText.text(this._info.name);
            layer.add(this.infoText);
        }
    }


    destroy() {
        super.destroy();
        if (this.infoText !== null) {
            this.infoText.remove()
            console.log("cleared text")
        }
    }

    setInfo(infoObj){
        this.info = infoObj;
    }

    load(){
        console.log("Abstract function")
    }

    _sceneFunc(context) {
        let width = this.width();
        let height = this.height();
        context.beginPath();
        context.rect(0, 0, width, height)
        context.closePath();
        context.fillStrokeShape(this);
    }

    clearText() {
        if (this.infoText !== null) {
            this.infoText.remove()
            console.log("cleared text")
        }

    }

    updateText(shapeName){
            this.infoText.text = shapeName;
            console.log("Updated text to : " + shapeName)
    }

    snapToGrid() {
        this.position({
            x: Math.round(this.x() / this.blockSize) * this.blockSize,
            y: Math.round(this.y() / this.blockSize) * this.blockSize,
        });

    }

    saveShapeDetails() {
        console.log("This shape does not contain information");
    }

    onPlace(){
        //this.snapToGrid();
    }


    get info() {
        return this._info;
    }

    set info(formData) {
        this._info = formData;
    }

    get type() {
        return this._type;
    }

    set type(type) {
        this._type = type
    }

}