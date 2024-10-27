import React from "react";
import "../../../App.css";
import { Button } from "./Button";
import "./HeroSection.css";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
      <div className="hero-container">
          <h1>Map Your World</h1>
          <p>Create and explore detailed indoor maps.</p>
          <div className="hero-btns">
              <Link to="/myMaps">
                  <Button className="btns" buttonStyle="btn--outline" buttonSize="btn--large">
                      Create maps
                  </Button>
              </Link>
              <Link to="/Maps">
                  <Button
                      className="btns"
                      buttonStyle="btn--primary"
                      buttonSize="btn--large"
                  >
                      Browse Maps <i className="far fa-play-circle"/>
                  </Button>
              </Link>
          </div>
      </div>
  );
}

export default HeroSection;
