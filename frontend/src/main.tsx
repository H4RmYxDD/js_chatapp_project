import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import LoginPage from './pages/LoginPage.tsx';
import { ToastContainer } from 'react-toastify';
import RegisterPage from './pages/RegisterPage.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import MainPage from './pages/MainPage.tsx';
import UsersPage from './pages/UsersPage.tsx';
import ConversationPage from './pages/ConversationPage.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/messages/conversation/:userId" element={<ConversationPage />} />
            </Routes>
        </BrowserRouter>
        <ToastContainer theme="colored" />
    </StrictMode>,
);
