import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import React, { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RouterInterface from './upper-level-components/RouterInterface'
import Pages from './upper-level-components/Pages'
import PageNotFound from './upper-level-components/PageNotFound'
import BraveLogo from './pdf/BraveLogo.svg'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    // eslint-disable-next-line react/jsx-filename-extension, react/jsx-no-useless-fragment
    <>
      {loggedIn ? (
        <BrowserRouter>
          <Routes>
            {Object.values(Pages).map(page => {
              return page.paths.map(route => {
                return <Route path={`${route}`} element={<RouterInterface viewState={page.displayName} />} />
              })
            })}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <div className="googleLoginContainer">
          <img src={BraveLogo} alt="Brave Logo" width="128px" />
          <h2>Please log in to use PA.</h2>
          <GoogleLogin
            onSuccess={response => {
              console.log('Login Success:', JSON.stringify(response))
              setLoggedIn(true)
            }}
            onError={error => {
              console.log('Login Error:', error)
            }}
          />
        </div>
      )}
    </>
  )
}

export default App
