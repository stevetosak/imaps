import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FinkiMaps from "./pages/FinkiMaps/FinkiMaps";
import Maps from "./pages/Maps/Maps";
import LoginPage from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import IMaps from "./pages/IMaps/IMaps";
import Draw from "./pages/Draw/Draw";
import Error from "./pages/Error/Error";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import "./App.css";

function App() {
  //TRUE E NAMESTENO ZA PRISTAP DO DRAW BEZ LOGIN (trebit false da e)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log(isAuthenticated)
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    else{
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (token) => {
    console.log(isAuthenticated)
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IMaps />} />
        <Route path="/Maps/FinkiMaps/View" element={<FinkiMaps />} />
        <Route path="/Maps" element={<Maps />} />
        <Route path="/Login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/Signup" element={<Signup />} />

        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/Maps/FinkiMaps/Draw" element={<Draw />} />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
