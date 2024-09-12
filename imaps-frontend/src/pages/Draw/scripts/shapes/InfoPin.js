import Konva from "konva";
import styles from "../../Draw.module.css"
import MapShape from "./MapShape";
import Factory from "../util/Factory";
import { _registerNode } from 'konva/lib/Global';
export default class InfoPin extends MapShape {
  constructor(mousePos,blockSize,layer,snappable,id) {
    super(
      {
        x: mousePos.x,
        y: mousePos.y,
        radiusX: blockSize / 3,
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
    this.boxID = id;
    this.infoBox;
    this.stagePos;
    this.isDisplayingBox = false;
    this.setAttr("room-name",undefined);
    this.setAttr("room-type",undefined);
    this.setAttr("room-description",undefined);
    this.setAttr("isConnector",false);

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

  updateInfo(){
    let roomName = this.infoBox.querySelector("#room-name").value;
    console.log(roomName + "testroom");
    let type = this.infoBox.querySelector("#type").value;
    let description = this.infoBox.querySelector("#description").value;
    let isConnector = document.getElementById("checkbox-" + this.boxID).checked;
    this.setAttr("room-name",roomName);
    this.setAttr("room-type",type);
    this.setAttr("description",description);
    this.setAttr("isConnector",isConnector);

    if(isConnector){
      // ova da sa koregirat ne globalno
      let connectorOptions = document.getElementById("entranceOptions-" + this.boxID)
      let from = connectorOptions.querySelector("#from").value;
      let to = connectorOptions.querySelector("#to").value;
      this.setAttr("from-room",from);
      this.setAttr("to-room",to);
    } else {
      this.setAttr("from-room",undefined);
      this.setAttr("to-room",undefined);
    }
  }


  displayInfoBox(hide) {
    if (this.isDisplayingBox && hide) {
      this.isDisplayingBox = false;
      this.infoBox.style.display = "none";
      this.updateInfo();
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

  static hideMenus(e,clear,pins) {
    if (e.key === "Escape" || clear) {

      pins.forEach(pin => {
        pin.updateInfo();
      });

      for (let i = 0; i < Factory.infoPinCount; i++) {
        let menu = document.getElementById("InfoPinMenu-" + i);
        if (menu !== null && menu !== undefined) {
          menu.style.display = "none";
        }
      }
    }
  }
}

InfoPin.prototype.className = 'InfoPin'
_registerNode(InfoPin);
