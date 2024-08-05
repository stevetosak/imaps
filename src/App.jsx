import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FinkiMaps from "./pages/FinkiMaps/FinkiMaps";
import Maps from "./pages/Maps/Maps";
import Login from "./pages/Login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./pages/Signup/Signup";
import IMaps from "./pages/IMaps/IMaps";
import Draw from "./pages/Draw/Draw";
import Error from "./pages/Error/Error";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<IMaps />} />
          <Route path="/Maps/FinkiMaps" element={<FinkiMaps />} />
          <Route path="/Maps" element={<Maps />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Maps/FinkiMaps/Draw" element={<Draw />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
