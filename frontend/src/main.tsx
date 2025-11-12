import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginPage from './pages/LoginPage.tsx'
import { ToastContainer } from 'react-toastify'
import RegisterPage from './pages/RegisterPage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage/>} />
    </Routes>
    </BrowserRouter>
    <ToastContainer theme='colored'/>
  </StrictMode>,
)
