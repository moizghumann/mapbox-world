import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import "mapbox-gl/dist/mapbox-gl.css";
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('map')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
