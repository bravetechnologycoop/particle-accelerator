import React from 'react'
import ReactDOM from 'react-dom'
import { CookiesProvider } from 'react-cookie'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App'
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  // eslint-disable-next-line react/jsx-filename-extension
  <CookiesProvider defaultSetOptions={{ path: '/' }}>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </GoogleOAuthProvider>
  </CookiesProvider>,
  // eslint-disable-next-line no-undef
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
