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
        <Route path="/validator" element={<RouterInterface viewState="Validator" changeViewState={changeViewState} />} />
        <Route path="/activation-history" element={<RouterInterface viewState="Activation History" changeViewState={changeViewState} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
