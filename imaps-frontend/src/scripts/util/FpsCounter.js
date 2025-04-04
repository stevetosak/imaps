const times = [];
let fps;

export function fpsCounterLoop() {
  window.requestAnimationFrame(() => {
    let cont = document.getElementById("fpsCounter");
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    cont.innerText = `FPS: ${fps}`;
    //console.log("FPS: " + fps)
    fpsCounterLoop();
  });
}
