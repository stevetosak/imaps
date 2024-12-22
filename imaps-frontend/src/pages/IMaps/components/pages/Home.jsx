import React from "react";
import "./Home.scss";
import { Link } from "react-router-dom";
import { Button } from "../Button.jsx";
import Cards from "../Cards.jsx";
import Footer from "../Footer.jsx";
import sl from "../../../../assets/bg-home-light-gray.png"

function Home() {
  return (
    <div className="home">
      <div className="hero-container">
        <h1>Map Your World</h1>
        <h2 className="description">Create and explore detailed indoor maps.</h2>
        <div className="hero-btns">
          <Link to="/Maps">
            <Button buttonSize="btn--large" >
              Browse Maps <i className="far fa-play-circle" />
            </Button>
          </Link>
          <Link to="/myMaps">
            <Button buttonSize="btn--large" buttonStyle="btn--outline">
              Create Maps
            </Button>
          </Link>
        </div>
      </div>
      <Cards />
      <Footer></Footer>
    </div>
  );
}

export default Home;
