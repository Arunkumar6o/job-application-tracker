import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import CSS Design System stylesheets
import './styles/index.css';
import './styles/layout.css';
import './styles/auth.css';
import './styles/dashboard.css';
import './styles/applications.css';
import './styles/form.css';
import './styles/modal.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
