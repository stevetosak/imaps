import Konva from "konva";
import styles from "../Draw.module.css";
export default class InfoNode extends Konva.Shape {
  constructor(config) {
    super(config);
    this.className = "InfoPin";
    this.infoBox = this.createInfoBox();
    this.isDisplayingBox = false;

    this.on("mouseover", () => {
      this.fill("yellow");
    });
    this.on("mouseout", () => {
      this.fill("red");
    });
  }
  _sceneFunc(context, shape) {
    const { radiusX, radiusY, tailHeight } =
      this.attrs;

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

  displayInfoBox(stage,showWhenDrag) {

    if(this.isDisplayingBox && !showWhenDrag){
      this.isDisplayingBox = false;
      this.infoBox.style.display = 'none';
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

  createInfoBox() {
    let cont = document.createElement("div");
    cont.setAttribute("id", "nodeOptions");
    cont.className = styles.nodeOptions;

    //<input type="text" placeholder="Description"></input>

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

    document.getElementById("wrapper").appendChild(cont);

    return cont;
  }
}
