import React from "react";
import "../../../App.css";
import { Button } from "./Button";
import "./HeroSection.css";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <div className="hero-container">
      <h1>Passionate Professional</h1>
      <p>What are you waiting for?</p>
      <div className="hero-btns">
        <Link to="/Maps/FinkiMaps/Draw">
          <Button className="btns" buttonStyle="btn--outline" buttonSize="btn--large">
            CREATE A MAP
          </Button>
        </Link>
        <Link to="/Maps">
          <Button
            className="btns"
            buttonStyle="btn--primary"
            buttonSize="btn--large"
            onClick={console.log("hey")}
          >
            EXPLORE MAPS <i className="far fa-play-circle" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;
