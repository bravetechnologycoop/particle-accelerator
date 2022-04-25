import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import RouterInterface from './RouterInterface'

function App() {
  // eslint-disable-next-line no-unused-vars
  const [viewState, setViewState] = useState('Home')

  function changeViewState(newState) {
    setViewState(newState)
  }

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RouterInterface viewState="Home" changeViewState={changeViewState} />} />
        <Route path="/home" element={<RouterInterface viewState="Home" changeViewState={changeViewState} />} />
        <Route path="/particle" element={<RouterInterface viewState="Particle" changeViewState={changeViewState} />} />
        <Route path="/clickup" element={<RouterInterface viewState="ClickUp" changeViewState={changeViewState} />} />
        <Route path="/activator" element={<RouterInterface viewState="Activator" changeViewState={changeViewState} />} />
        <Route path="/device-lookup" element={<RouterInterface viewState="Device Lookup" changeViewState={changeViewState} />} />
        <Route path="/activation-history" element={<RouterInterface viewState="Activation History" changeViewState={changeViewState} />} />
        <Route path="/activated-devices" element={<RouterInterface viewState="Activated Devices" changeViewState={changeViewState} />} />
        <Route path="/door-sensor-pairing" element={<RouterInterface viewState="Door Sensor Pairing" changeViewState={changeViewState} />} />
        <Route path="/renamer" element={<RouterInterface viewState="Renamer" changeViewState={changeViewState} />} />
        <Route path="/button-registration" element={<RouterInterface viewState="Button Registration" changeViewState={changeViewState} />} />
        <Route
          path="/twilio-number-purchasing"
          element={<RouterInterface viewState="Twilio Number Purchasing" changeViewState={changeViewState} />}
        />
        <Route path="/device-manager" element={<RouterInterface viewState="Device Manager" changeViewState={changeViewState} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
