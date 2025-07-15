import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastContainer, toast } from 'react-toastify'
import { UserProvider } from './context/UserContext.tsx'
import { RefreshProvider } from './context/RefreshContext.tsx'

createRoot(document.getElementById('root')!).render(
    <UserProvider>
      <RefreshProvider>
    <App />
    <ToastContainer autoClose={1000}/>
    </RefreshProvider>
    </UserProvider>
)
