import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RouterInterface from './upper-level-components/RouterInterface'
import Pages from './upper-level-components/Pages'
import PageNotFound from './upper-level-components/PageNotFound'
import GoogleLoginScreen from './upper-level-components/GoogleLoginScreen'

function App() {
  const [googlePayload, setGooglePayload] = useState(null)

  // If not logged in, display the Google login screen instead.
  // NOTE: The GoogleLoginScreen component checks cookies for an existing session,
  //   and will call onLogin in the case that the previous session is recent enough.
  if (googlePayload == null) {
    // eslint-disable-next-line react/jsx-filename-extension
    return <GoogleLoginScreen onLogin={payload => setGooglePayload(payload)} />
  }

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <BrowserRouter>
      <Routes>
        {Object.values(Pages).map(page => {
          return page.paths.map(route => {
            return <Route path={`${route}`} element={<RouterInterface viewState={page.displayName} googlePayload={googlePayload} />} />
          })
        })}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
