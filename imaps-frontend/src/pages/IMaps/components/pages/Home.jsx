import React from 'react';
import "./Home.scss";
import {Link} from "react-router-dom";
import {Button} from "../Button.jsx";


function Home() {
  return (
        <div className="home">
            <div className="hero-container">
                <h1>Map Your World</h1>
                <h2>Create and explore detailed indoor maps.</h2>
                <div className="hero-btns">
                    <Link to="/myMaps">
                        <Button className="btns" buttonSize="btn--large">Create Maps</Button>
                    </Link>
                    <Link to="/Maps">
                        <Button
                            className="btns"
                            buttonSize="btn--large"
                        >
                            Browse Maps <i className="far fa-play-circle"/>
                        </Button>
                    </Link>
                </div>
            </div>
            {/* <Cards /> */}
        </div>
  );
}

export default Home;
