import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import './index.css';

import LoginPage from './routes/login';
import ChatPage from './routes/chat';
import HomePage from './routes/home';
import NotFoundPage from './routes/not-found';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/notfound" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/notfound" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
