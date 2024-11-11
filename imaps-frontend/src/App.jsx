// eslint-disable-next-line no-unused-vars
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
import HttpService from "./scripts/net/HttpService";
import MapView from "./pages/MapView/MapView.jsx";
import CreateMaps from "./pages/CreateMaps/CreateMaps.jsx";
import {AuthContext, AuthProvider} from "./components/AuthContext/AuthContext.jsx";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';




function App() {

  return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<IMaps />} />
            <Route path="/Maps/:mapName/View" element={<MapView isPrivate={false}/>} />
            <Route path="/Maps" element={<Maps />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Signup" element={<Signup />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/myMaps/:mapName/Draw" element={<Draw />} />
              <Route path="/myMaps" element={<CreateMaps />} />
              <Route path="/myMaps/:mapName/View" element={<MapView isPrivate={true} />} />
            </Route>

            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
      </AuthProvider>

  );
}

export default App;
