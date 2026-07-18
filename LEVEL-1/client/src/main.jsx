import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import { ActivityProvider } from './context/ActivityContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import ToastViewport from './components/ToastViewport.jsx'

// client/src/main.jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <ToastProvider>
              <ProductsProvider>
                <ActivityProvider>
                  <App />
                </ActivityProvider>
              </ProductsProvider>
            </ToastProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)