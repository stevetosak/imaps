import Konva from "konva";
import styles from "../../Draw.module.css"
import MapShape from "./MapShape";
import Factory from "../util/Factory";
export default class InfoPin extends MapShape {
  constructor(mousePos,blockSize,layer,snappable,id) {
    super(
      {
        x: mousePos.x,
        y: mousePos.y,
        radiusX: blockSize/3,
        radiusY: blockSize * 0.45,
        tailHeight: blockSize * 0.8,
        fill: "#d70113",
        stroke: "#1b1b1b",
        strokeWidth: 0.2,
        draggable: true,
        name: "mapObj",
      },
      layer,
      blockSize,
      snappable
    );
    this.className = "InfoPin";
    this.boxID = id;
    this.infoBox;
    this.stagePos;
    this.isDisplayingBox = false;

    this.on("mouseover", () => {
      this.fill("yellow");
    });
    this.on("mouseout", () => {
      this.fill("red");
    });

  }
  _sceneFunc(context, shape) {
    const { radiusX, radiusY, tailHeight } = this.attrs;

    context.beginPath();
    context.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
    context.closePath();
    context.fillStrokeShape(shape);

    context.beginPath();
    context.moveTo(-radiusX, radiusY);
    context.lineTo(0, radiusY + tailHeight);
    context.lineTo(radiusX, radiusY);
    context.closePath();

    context.fillStrokeShape(shape);
  }

  init(stagePos){
    this.stagePos = stagePos;
    this.infoBox = Factory.createInfoBox(this.boxID,this.updateBox.bind(this)); // html element e ova
    this.on('dblclick', () => {
      this.displayInfoBox(true);
      this.moveToTop();
    })
    this.on('dragend', () => {
      if(this.isDisplayingBox){
        this.displayInfoBox(false);
      }
    })
  }

  displayInfoBox(hide) {
    if (this.isDisplayingBox && hide) {
      this.isDisplayingBox = false;
      this.infoBox.style.display = "none";
    } else {
      const shapePos = this.getClientRect();
      this.infoBox.style.display = "block";
      const optionsBoxX = this.stagePos.left + shapePos.x;
      const optionsBoxY = this.stagePos.top + shapePos.y - this.infoBox.offsetHeight;

      this.infoBox.style.left = `${optionsBoxX}px`;
      this.infoBox.style.top = `${optionsBoxY}px`;
      this.isDisplayingBox = true;
    }
  }

  updateBox() {
    let checkbox = document.getElementById("checkbox-" + this.boxID);
    let div = document.getElementById("entranceOptions-" + this.boxID);
    if (checkbox.checked) {
      div.style.display = "block";
    } else {
      div.style.display = "none";
    }
    this.displayInfoBox(false);
  }

  static hideMenus(e) {
    if (e.key === "Escape") {
      for (let i = 0; i < Factory.infoPinCount; i++) {
        let menu = document.getElementById("InfoPinMenu-" + i);
        if (menu !== null && menu !== undefined) {
          menu.style.display = "none";
        }
      }
    }
  }

}
