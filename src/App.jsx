import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FinkiMaps from "./pages/FinkiMaps/FinkiMaps";
import Maps from "./pages/Maps/Maps";
import Login from "./pages/Login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./pages/Signup/Signup";
import IMaps from "./pages/IMaps/IMaps";
import Draw from "./pages/Draw/Draw";

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
        </Routes>
        <br />
        <br />
        <hr />
        <nav>
          <ul>
            <li>
              <Link to="/">Home (IMaps)</Link>
            </li>
            <li>
              <Link to="/Maps/FinkiMaps">FinkiMaps</Link>
            </li>
            <li>
              <Link to="/Maps">Maps</Link>
            </li>
            <li>
              <Link to="/Login">Login</Link>
            </li>
            <li>
              <Link to="/Signup">Signup</Link>
            </li>
            <li>
              <Link to="/Maps/FinkiMaps/Draw">Draw</Link>
            </li>
          </ul>
        </nav>
      </div>
    </Router>
  );
}

export default App;
