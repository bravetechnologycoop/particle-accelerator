import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  // eslint-disable-next-line react/jsx-filename-extension
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  // eslint-disable-next-line no-undef
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
