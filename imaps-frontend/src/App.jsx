// eslint-disable-next-line no-unused-vars
import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import BrowseMaps from "./pages/BrowseMaps/BrowseMaps.jsx";
import LoginPage from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import IMaps from "./pages/IMaps/IMaps";
import Draw from "./pages/Draw/Draw";
import Error from "./pages/Error/Error";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import "./App.css";
import MapView from "./pages/MapView/MapView.jsx";
import MyMaps from "./pages/MyMaps/MyMaps.jsx";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {AppProvider} from "./components/AppContext/AppContext.jsx";
import AdminPage from "./pages/AdminPage/AdminPage.jsx";
import {AuthCallback} from "./pages/AuthCallback.jsx";


function App() {

    return (

        <AppProvider>
            <Router>
                <Routes>

                    <Route element={<ProtectedRoute/>}>
                        <Route path="/myMaps/Draw/:mapName" element={<Draw/>}/>
                        <Route path="/myMaps" element={<MyMaps/>}/>
                        <Route path="/myMaps/View/:mapName" element={<MapView isPrivate={true}/>}/>
                        <Route path="/Admin" element={<AdminPage/>}/>
                    </Route>
                    <Route path="/" element={<IMaps/>}/>
                    <Route path="/Maps/View/:mapName" element={<MapView isPrivate={false}/>}/>
                    <Route path="/Maps" element={<BrowseMaps/>}/>
                    <Route path="/auth-callback" element={<AuthCallback/>}/>


                    <Route path="/Login" element={<LoginPage/>}/>
                    <Route path="/Signup" element={<Signup/>}/>

                    <Route path="*" element={<Error/>}/>
                </Routes>
            </Router>
        </AppProvider>


    );
}

export default App;
