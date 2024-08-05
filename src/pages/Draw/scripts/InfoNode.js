import Konva from 'konva'
export default class InfoNode extends Konva.Shape{
    constructor(config) {
        super(config);
        this.className = 'NavigationPin';
      }
      _sceneFunc(context,shape) {

        const { x, y, radius } = this.attrs;

        // Draw a circle part
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.closePath();
        context.fillStrokeShape(shape);

        // Draw the tail part
        context.beginPath();
        context.moveTo(x, y + radius);
        context.lineTo(x - radius / 2, y + radius * 2);
        context.lineTo(x + radius / 2, y + radius * 2);
        context.closePath();
        context.translate(x,y);
        context.fillStrokeShape(shape);
      }
}
