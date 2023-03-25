import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(


  <Auth0Provider
    domain='dev-mf6lqfng.us.auth0.com'
    clientId='5c1HQIOd6HlVEi2CLLfTPO7HCImJ9qZr'
    redirectUri={window.location.origin}>
    <React.StrictMode>
      <App />
      <ToastContainer position="top-center" theme="colored" autoClose={2000} />
    </React.StrictMode>
  </Auth0Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
