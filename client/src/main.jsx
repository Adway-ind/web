import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { TransitionProvider } from "../src/custom/TransitionContext";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TransitionProvider>
        <App />
      </TransitionProvider>
    </BrowserRouter>
  </StrictMode>,
)
