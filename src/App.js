import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import RouterInterface from './RouterInterface'

function App() {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RouterInterface viewState="Home" />} />
        <Route path="/home" element={<RouterInterface viewState="Home" />} />
        <Route path="/particle" element={<RouterInterface viewState="Particle" />} />
        <Route path="/clickup" element={<RouterInterface viewState="ClickUp" />} />
        <Route path="/activator" element={<RouterInterface viewState="Activator" />} />
        <Route path="/device-lookup" element={<RouterInterface viewState="Device Lookup" />} />
        <Route path="/activation-history" element={<RouterInterface viewState="Activation History" />} />
        <Route path="/activated-devices" element={<RouterInterface viewState="Activated Devices" />} />
        <Route path="/door-sensor-pairing" element={<RouterInterface viewState="Door Sensor Pairing" />} />
        <Route path="/renamer" element={<RouterInterface viewState="Renamer" />} />
        <Route path="/button-registration" element={<RouterInterface viewState="Button Registration" />} />
        <Route path="/twilio-number-purchasing" element={<RouterInterface viewState="Twilio Number Purchasing" />} />
        <Route path="/device-manager" element={<RouterInterface viewState="Device Manager" />} />
        <Route path="/sensor-provisioning-guide" element={<RouterInterface viewState="Sensor Provisioning Guide" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
