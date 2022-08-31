import * as React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import {
  ChatPage,
  HomePage,
  LoginPage,
  NotFoundPage,
} from '~/pages';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Navigate to={'/home'} />} />
        <Route path={'/login'} element={<LoginPage />} />
        <Route path={'/home'} element={<HomePage />} />
        <Route path={'/chat'} element={<ChatPage />} />
        <Route path={'/not-found'} element={<NotFoundPage />} />
        <Route path={'*'} element={<Navigate to={'/not-found'} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
