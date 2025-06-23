import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TemplateProvider } from './context/TemplateContext'; 
import { ThemeProvider } from "./context/ThemeContext";

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    <TemplateProvider>
    <App />
    </TemplateProvider>
    </ThemeProvider>
  </StrictMode>,
)
