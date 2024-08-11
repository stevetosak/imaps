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
    this.createInfoBox();
    this.on('dblclick', () => {
      this.displayInfoBox(stagePos,true);
      this.moveToTop();
    })
    this.on('dragend', () => {
      if(this.isDisplayingBox){
        this.displayInfoBox(stagePos,false);
      }
    })
  }

  createInfoBox() {
    let id = this.boxID;
    let cont = document.createElement("div");
    cont.setAttribute("id", "InfoPinMenu".concat("-" + id));
    cont.className = styles.nodeOptions;

    // ova e preshit ama privremeno

    let h1 = document.createElement("h1");
    h1.innerText = "Add Info";
    h1.style.textAlign = "center";
    h1.style.fontSize = "8px";
    h1.style.fontWeight = "bold";
    h1.style.color = "#141414f6";

    cont.appendChild(h1);

    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Name");
    cont.appendChild(input);

    let input1 = document.createElement("input");
    input1.setAttribute("type", "text");
    input1.setAttribute("placeholder", "Type");
    cont.appendChild(input1);

    let input2 = document.createElement("input");
    input2.setAttribute("type", "text");
    input2.setAttribute("placeholder", "Description");
    cont.appendChild(input2);

    let connectorCheckBoxInput = document.createElement("input");
    connectorCheckBoxInput.setAttribute("type", "checkbox");
    connectorCheckBoxInput.setAttribute("id", "checkbox-" + id);
    connectorCheckBoxInput.addEventListener(
      "change",
      this.updateBox.bind(this)
    );

    let labelForCheckBox = document.createElement("label");
    labelForCheckBox.innerText = "Connector";
    labelForCheckBox.setAttribute("for", "checkbox-" + id);

    let checkboxContainer = document.createElement("div");
    checkboxContainer.className = styles.checkboxCont;
    checkboxContainer.appendChild(labelForCheckBox);
    checkboxContainer.appendChild(connectorCheckBoxInput);

    cont.appendChild(checkboxContainer);

    let entranceDiv = document.createElement("div");
    entranceDiv.setAttribute("id", "entranceOptions-".concat(id));
    entranceDiv.style.display = "none";

    let entranceFrom = document.createElement("input");
    entranceFrom.setAttribute("type", "text");
    entranceFrom.setAttribute("placeholder", "From");

    let entranceTo = document.createElement("input");
    entranceTo.setAttribute("type", "text");
    entranceTo.setAttribute("placeholder", "To");

    entranceDiv.appendChild(entranceFrom);
    entranceDiv.appendChild(entranceTo);

    cont.appendChild(entranceDiv);

    document.getElementById("wrapper").appendChild(cont);

    this.infoBox = cont;
  }

  displayInfoBox(stagePos, hide) {
    if (this.isDisplayingBox && hide) {
      this.isDisplayingBox = false;
      this.infoBox.style.display = "none";
    } else {
      const shapePos = this.getClientRect();
      this.infoBox.style.display = "block";
      const optionsBoxX = stagePos.left + shapePos.x;
      const optionsBoxY = stagePos.top + shapePos.y - this.infoBox.offsetHeight;

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
  }

  static hideMenus(e) {
    if (e.key === "Escape") {
      for (let i = 0; i < Factory.count; i++) {
        let menu = document.getElementById("InfoPinMenu-" + i);
        if (menu !== null && menu !== undefined) {
          menu.style.display = "none";
        }
      }
    }
  }

  
  destroySelf() {
    this.infoBox.remove();
  }
}
