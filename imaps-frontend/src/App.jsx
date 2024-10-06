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
import HttpService from "./Net/HttpService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    const httpService = new HttpService('http://localhost:8080/api/auth');

    const verifyToken = async () => {
      try {
        const response = await httpService.get(`/verify?token=${token}`);
        if(response.username){
          setIsAuthenticated(true);
          console.log("good")
        }
      } catch (error) {
        console.log("ERROR: ", error)
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyToken();
      //setLoading(false);
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
