import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import styles from "./IMaps.module.css";
import Home from "./components/pages/Home";

function IMaps() {
  return (
    <>
      <Navbar></Navbar>
      <Home></Home>
    </>
  );
}

export default IMaps;
