import React from "react";
import "./Cards.css";
import CardItem from "./CardItem";
import img9 from "../images/img-9.jpg";
import img2 from "../images/img-2.jpg";
import img3 from "../images/img-3.jpg";
import img4 from "../images/img-4.jpg";
import img8 from "../images/img-8.jpg";

function Cards() {
  return (
    <div className="cards">
      <h1>iMaps offers:</h1>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src={img9}
              text="Create intricate floor plans for your building with precision and ease."
              label="Create"
              path="#"
            />
            <CardItem
              src={img2}
              text="Explore and navigate through complex building layouts seamlessly."
              label="Explore"
              path="#"
            />
          </ul>
          <ul className="cards__items">
            <CardItem
              src={img3}
              text="Add custom icons, labels, and markers to personalize your indoor maps."
              label="Customize"
              path="#"
            />
            <CardItem
              src={img4}
              text="Ensure accessibility by mapping out routes and facilities for all users."
              label="Accessibility"
              path="#"
            />
            <CardItem
              src={img8}
              text="Share your maps with others and collaborate in real-time for efficient space planning."
              label="Collaboration"
              path="#"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
