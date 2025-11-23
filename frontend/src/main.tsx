import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import FIRST
import './index.css';
import './theme.css';
import './talkberry-theme.css';
import LoginPage from './pages/LoginPage';
import { ToastContainer } from 'react-toastify';
import RegisterPage from './pages/RegisterPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import UsersPage from './pages/UsersPage';
import ConversationPage from './pages/ConversationPage';
import ThreadPage from './pages/ThreadPage';
import MessagesPage from './pages/MessagesPage';
import TalkBerryNavbar from './components/Navbar';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const token = localStorage.getItem('token');
  
  return (
    <div className="app-container" style={{ minHeight: '100vh', background: 'var(--berry-light)' }}>
      {token && <TalkBerryNavbar />}
      <div className={token ? 'container-fluid py-4' : ''}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/messages/conversation/:userId" element={<ConversationPage />} />
          <Route path="/messages/thread/:id" element={<ThreadPage />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Routes>
      </div>
      <ToastContainer 
        position="bottom-right"
        theme="light"
      />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);