import Entrance from "../shapes/Entrance";
import Wall from "../shapes/Wall";
import Room from "../shapes/Room";
import InfoPin from "../shapes/InfoPin";
import styles from "../../Draw.module.css"
import Konva from "konva";
import RenderedRoom from "../../../FinkiMaps/scripts/shapes/RenderedRoom";
export default class Factory {

  static infoPinCount = 0;
  static wallCount = 0;
  static entranceCount = 0;
  static roomCount = 0;

  static createShape(shapeType, position, blockSize, layer, rotation) {
    console.log(shapeType, "VNATRE VO FACTORY")
    switch (shapeType) {
      case "Entrance":
        return new Entrance(position, blockSize, layer, rotation,true);
      case "Room":
        return new Room(position, blockSize, layer, rotation,true, this.roomCount++);
      case "Wall":
        return new Wall(position, blockSize, layer, rotation,true);
      case "InfoPin":
        return new InfoPin(position, blockSize, layer, false,this.infoPinCount++);
      default:
        throw new Error("Invalid shape type: " + shapeType);
    }
  }

  static createRenderedShape(shapeType,attrs){
    let scaleX = (attrs.scaleX ? parseFloat(attrs.scaleX) : 1);
    let scaleY =  (attrs.scaleY ? parseFloat(attrs.scaleY) : 1);
    switch (shapeType) {
      case "Entrance":
        return new Konva.Rect({
          x: attrs.x,
          y: attrs.y,
          width: attrs.width * scaleX,
          height: attrs.height * scaleY,
          fill: 'blue',
          stroke: 'black',
          strokeWidth: 1,
          draggable: false,
          rotation: attrs.rotation,
          cornerRadius:3
        });
      case "Room":
        return new RenderedRoom(attrs,scaleX,scaleY);
      case "Wall":
        return new Konva.Rect({
          x: attrs.x,
          y: attrs.y,
          width: attrs.width * scaleX,
          height: attrs.height * scaleY,
          fill: 'grey',
          stroke: 'black',
          strokeWidth: 1,
          draggable: false,
          rotation: attrs.rotation,
          cornerRadius:3
        });
      default:
        throw new Error("Invalid shape type." + shapeType);
    }
  }

  static createInfoBox(id,updateBoxFunc) {
    let menu = document.createElement("div");
    menu.setAttribute("id", "InfoPinMenu".concat("-" + id));
    menu.className = styles.nodeOptions;


    let h1 = document.createElement("h1");
    h1.innerText = "Add Info";
    h1.style.textAlign = "center";
    h1.style.fontSize = "8px";
    h1.style.fontWeight = "bold";
    h1.style.color = "#141414f6";
    menu.appendChild(h1);

    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Name");
    input.setAttribute("id","room-name");
    menu.appendChild(input);

    let input1 = document.createElement("input");
    input1.setAttribute("type", "text");
    input1.setAttribute("placeholder", "Type");
    input1.setAttribute("id","type")
    menu.appendChild(input1);

    let input2 = document.createElement("input");
    input2.setAttribute("type", "text");
    input2.setAttribute("placeholder", "Description");
    input2.setAttribute("id","description");
    menu.appendChild(input2);

    let connectorCheckBoxInput = document.createElement("input");
    connectorCheckBoxInput.setAttribute("type", "checkbox");
    connectorCheckBoxInput.setAttribute("id", "checkbox-" + id);
    connectorCheckBoxInput.addEventListener(
      "change",
      updateBoxFunc
    );

    let labelForCheckBox = document.createElement("label");
    labelForCheckBox.innerText = "Connector";
    labelForCheckBox.setAttribute("for", "checkbox-" + id);

    let checkboxContainer = document.createElement("div");
    checkboxContainer.className = styles.checkboxCont;
    checkboxContainer.appendChild(labelForCheckBox);
    checkboxContainer.appendChild(connectorCheckBoxInput);

    menu.appendChild(checkboxContainer);

    let entranceDiv = document.createElement("div");
    entranceDiv.setAttribute("id", "entranceOptions-".concat(id));
    entranceDiv.style.display = "none";

    let entranceFrom = document.createElement("input");
    entranceFrom.setAttribute("type", "text");
    entranceFrom.setAttribute("placeholder", "From");
    entranceFrom.setAttribute("id","from");

    let entranceTo = document.createElement("input");
    entranceTo.setAttribute("type", "text");
    entranceTo.setAttribute("placeholder", "To");
    entranceTo.setAttribute("id", "to");

    entranceDiv.appendChild(entranceFrom);
    entranceDiv.appendChild(entranceTo);

    menu.appendChild(entranceDiv);

    document.getElementById("wrapper").appendChild(menu);

    return menu;
  }
}
