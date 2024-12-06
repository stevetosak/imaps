export const zoomStage = (e,stage,shift=false) => {
    if (shift && !e.evt.shiftKey) return;

    e.evt.preventDefault();

    const scaleFactor = e.evt.deltaY > 0 ? 0.85 : 1.2;

    const prevScale = stage.scaleX();

    let newScale = prevScale * scaleFactor;

    const mousePos = stage.getRelativePointerPosition();

    let mousePoint = {
        x: (mousePos.x - stage.x()) / prevScale,
        y: (mousePos.y - stage.y()) / prevScale,
    };

    stage.scale({
        x: newScale,
        y: newScale,
    });

    let newStagePos = {
        x: mousePos.x - mousePoint.x * newScale,
        y: mousePos.y - mousePoint.y * newScale,
    };

    stage.position(newStagePos);
    // this.drawGrid();
    stage.batchDraw();
}
