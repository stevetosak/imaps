import Konva from 'konva'
export class MapShape extends Konva.Rect {
    constructor(config, layer, blockSize) {
      if (new.target === MapShape) {
        throw new Error("Cannot instantiate abstract class BaseShape directly.");
      }
      super(config);
      this.layer = layer;
      this.blockSize = blockSize;
      this.shadowObj = null;
      this.shadowForStrokeEnabled(false);
      this.on("mouseover", () => (document.body.style.cursor = "pointer"));
      this.on("mouseout", () => (document.body.style.cursor = "default"));
      this.on("dblclick", () => {
        this.moveToTop();
        this.getLayer()
          .find("Transformer")
          .forEach((t) => t.moveToTop());
      });
      this.on("dragend", () => {
        this.position({
            x: Math.round(this.x() / this.blockSize) * this.blockSize,
            y: Math.round(this.y() / this.blockSize) * this.blockSize
        });
      });
    
    }
  }

export class Entrance extends MapShape {
    constructor(mousePos, blockSize, layer,rotation) {
      super(
        {
          x: mousePos.x,
          y: mousePos.y,
          width: blockSize,
          height: blockSize * 2,
          fill: "#BC1F30",
          stroke: "grey",
          strokeWidth: 1,
          opacity: 0.85 ,
          name: "mapObj",
          draggable: true,
          rotation: rotation,
          zIndex: 1,
        },
        layer,
        blockSize
      );
    }
  }

export class Room extends MapShape {
    constructor(mousePos, blockSize, layer) {
      super(
        {
          x: mousePos.x,
          y: mousePos.y,
          width: blockSize * 5,
          height: blockSize * 3,
          fill: "white",
          stroke: "darkgrey",
          strokeWidth: 2,
          name: "mapObj",
          draggable: true,
        },
        layer,
        blockSize
      );
    }
  }

export class Wall extends MapShape {
    constructor(mousePos, blockSize, layer,rotation) {
      super(
        {
          x: mousePos.x,
          y: mousePos.y,
          width: blockSize,
          height: blockSize * 8,
          fill: "#DDE0F8",
          stroke: "grey",
          strokeWidth: 1,
          name: "mapObj",
          draggable: true,
          rotation: rotation,
          zIndex: 0,
        },
        layer,
        blockSize
      );
    }
  }