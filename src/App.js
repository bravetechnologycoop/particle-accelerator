import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import RouterInterface from './upper-level-components/RouterInterface'
import Pages from './upper-level-components/Pages'
import PageNotFound from './upper-level-components/PageNotFound'

function App() {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
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
  )
}

export default App
