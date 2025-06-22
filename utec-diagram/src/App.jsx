import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Login     from './pages/Login/Login';
import Register  from './pages/Register/Register';
import Workspace from './pages/Workspace';

/* Componente guardián */
function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login   />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <Workspace />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
