import React from "react";
import "./Home.css";
import Cards from "../Cards";
import HeroSection from "../HeroSection";
import Footer from "../Footer";

function Home() {
  return (
    <>
      <div className="home">
        <HeroSection />
        {/* <Cards /> */}
        <Footer />
      </div>
    </>
  );
}

export default Home;
