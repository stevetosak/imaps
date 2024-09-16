import { useEffect } from "react";
import { MapBuilder } from "./scripts/MapBuilder";
import styles from "./Draw.module.css";
import { fpsCounterLoop } from "./scripts/util/FpsCounter.js";

function Draw() {
  useEffect(() => {
    const app = new MapBuilder("container"); 
    fpsCounterLoop();
  }, []);
  return (
    <div className={styles.wrapper} id="wrapper">
      <div id="container" className={styles.cont}></div>
        <div className={styles.panel}>
          <ul className={styles.shapeOptions} id="shapeOptions">
            <li data-info="Entrance"  className={`${styles.shapeOption} ${styles.entrance}`} >Entrance</li>
            <li data-info="Wall" className={`${styles.shapeOption} ${styles.wall}`} id="wall">Wall</li>
            <li data-info="Room"  className={`${styles.shapeOption} ${styles.room}`} id="room">Room</li>
          </ul>
          <div id="fpscont" className={styles.fpscounter}>
            <p id="fpsCounter"></p>
          </div>
          <div id="render">
              <button id="render-button" type="button">Render</button>
            </div>
          <div id='info' className={styles.info}>
            <h3><b>InfoPins:</b></h3>
            <ul>
              <li>InfoPin sa klavat so desen klik</li>
              <li>So double click na nekoj pin go prikazvis/kries menito za informacii</li>
              <li>Ako sakas da obelezis vrata go klikvis checkbox i kazvis pomegju koi 2 prostorii e vratata</li>
              <li>So ESC gi kries otvorenite menija na site pins</li>
              <li><strong>BUG: RESIZE NA INFO PINS NE TREBIT DA IMAT, AKO PROBAS RESIZE NA DIJAGONALA SA BUGVIT CELOTO</strong></li>
            </ul>
            <h3><b>Info Za Canvas</b></h3>
            <ul>
              <li>So <i>double click</i> na nekoj shape, go klavas vo najgorniot sloj, so znacit ke e nad drugite elementi.
              <strong>VAZNO: elementi ko ke klavas na canvasot, vo nekoj sloj,sa klavaat vo obraten red od ko so vlegle vo toj sloj(LIFO), to znacit deka ako klajs shape1,pa shape2, shape 2 ke e nad shape1</strong></li>
              <li>So delete kopceto sa brisit selektiran shape</li>
              <li>Ako selektiras pojke shapes so drzenje na klik, site mozis da gi izbrisis</li>
              <li>Selektiran shape (hover) mozis da stegnis escape za da ne ti e pojke selected</li>
              <li>Selektiran shape (hover), go rotiras za 90 stepeni so scroll</li>
              <li>Imat snapping za pomestuvanje i za resize.(za resize najubo funkcionirat na pocetok, ko ke go selektiras element)</li>
              <li>So zoom in/out ili resize na prozorceto, canvasot si pret resize dinamicki, iako mozit malku da potkocit(todo)</li>
              <li>TODO: grid snapping na toggle</li>
              <li>Za hover na rooms valjda ke trebit da sa impl ko outline shape sho ke e child na info node</li>
            </ul>
          </div>
        </div>
    </div>
  );
}

export default Draw;
