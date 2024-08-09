import Konva from "konva";
import styles from "../Draw.module.css";
export default class InfoNode extends Konva.Shape {
  constructor(config) {
    super(config);
    this.className = "InfoPin";
    this.infoBox;
    this.isDisplayingBox = false;
    this.infoBoxId;

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

  displayInfoBox(stage, showWhenDrag) {
    if (this.isDisplayingBox && !showWhenDrag) {
      this.isDisplayingBox = false;
      this.infoBox.style.display = "none";
    } else {
      const shapePos = this.getClientRect();
      const stagePos = stage.container().getBoundingClientRect();
      this.infoBox.style.display = "block";

      const optionsBoxX = stagePos.left + shapePos.x + shapePos.width / 2;
      const optionsBoxY = stagePos.top + shapePos.y - this.infoBox.offsetHeight;

      this.infoBox.style.left = `${optionsBoxX}px`;
      this.infoBox.style.top = `${optionsBoxY}px`;
      this.isDisplayingBox = true;
    }
  }

  updateBox() {
    let checkbox = document.getElementById('checkbox-' + this.infoBoxId);
    let div = document.getElementById("entranceOptions-" + this.infoBoxId);
    if (checkbox.checked) {
      div.style.display = 'block';
    } else {
      div.style.display = 'none';
    }
  }

  createInfoBox(id) {
    this.infoBoxId = id;
    let cont = document.createElement("div");
    cont.setAttribute("id", "InfoPinMenu".concat("-" + id));
    cont.className = styles.nodeOptions;

    // ova e preshit ama privremeno

    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Room Name");
    cont.appendChild(input);

    let input1 = document.createElement("input");
    input1.setAttribute("type", "text");
    input1.setAttribute("placeholder", "Room Type");
    cont.appendChild(input1);

    let input2 = document.createElement("input");
    input2.setAttribute("type", "text");
    input2.setAttribute("placeholder", "Description");
    cont.appendChild(input2);

    let connectorCheckBoxInput = document.createElement("input");
    connectorCheckBoxInput.setAttribute("type", "checkbox");
    connectorCheckBoxInput.setAttribute("id", "checkbox-" + id);
    connectorCheckBoxInput.addEventListener('change',this.updateBox.bind(this));

    let labelForCheckBox = document.createElement("label");
    labelForCheckBox.innerText = "Connector";
    labelForCheckBox.setAttribute('for','checkbox-' + id)


    let checkboxContainer = document.createElement('div');
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

  destroySelf() {
    this.infoBox.remove();
  }
}
