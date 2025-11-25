import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './theme.css';
import './index.css';
import LoginPage from './pages/LoginPage.tsx';
import { ToastContainer } from 'react-toastify';
import RegisterPage from './pages/RegisterPage.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import MainPage from './pages/MainPage.tsx';
import UsersPage from './pages/UsersPage.tsx';
import ConversationPage from './pages/ConversationPage.tsx';
import ThreadPage from './pages/ThreadPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import PrivacyPage from './pages/PrivacyPage.tsx';
import PreferencesPage from './pages/PreferencesPage.tsx';
import AppLayout from './Components/AppLayout.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {}
                <Route
                    path="/main"
                    element={
                        <AppLayout>
                            <MainPage />
                        </AppLayout>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <AppLayout>
                            <UsersPage />
                        </AppLayout>
                    }
                />
                <Route
                    path="/messages/conversation/:userId"
                    element={
                        <AppLayout>
                            <ConversationPage />
                        </AppLayout>
                    }
                />
                <Route
                    path="/messages/thread/:id"
                    element={
                        <AppLayout>
                            <ThreadPage />
                        </AppLayout>
                    }
                />
                <Route
                    path="/settings/profile"
                    element={
                        <AppLayout>
                            <ProfilePage />
                        </AppLayout>
                    }
                />
                <Route
                    path="/settings/privacy"
                    element={
                        <AppLayout>
                            <PrivacyPage />
                        </AppLayout>
                    }
                />
                <Route
                    path="/settings/preferences"
                    element={
                        <AppLayout>
                            <PreferencesPage />
                        </AppLayout>
                    }
                />
            </Routes>
        </BrowserRouter>
        <ToastContainer theme="colored" />
    </StrictMode>,
);
