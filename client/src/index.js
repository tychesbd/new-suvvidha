import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import store from './store';
import './index.css';
import './neumorphic.css'; // Import neumorphic styles
import setupAxios from './utils/axiosConfig';

// Configure axios for the current environment
setupAxios();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          theme="light"
          toastStyle={{
            backgroundColor: 'var(--surface)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow-light), var(--shadow-dark)'
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);