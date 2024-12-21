import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

if (typeof GestureEvent === "undefined") {
    window.GestureEvent = class GestureEvent {};
}


ReactDOM.createRoot(document.getElementById('root')).render(
   <App />
)
