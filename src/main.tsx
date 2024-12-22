import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';  // Import Bootstrap CSS
import './index.css';  // Import your custom CSS file, which includes Tailwind CSS
import App from './App.tsx';  // Your App component
import '@fortawesome/fontawesome-free/css/all.min.css';
//import './App.css'; // Add CSS for modern styling


createRoot(document.getElementById('root')!).render(
  <App />
);
