// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Login     from './pages/Login/Login';
import Register  from './pages/Register/Register';
import Workspace from './pages/Workspace';

// PrivateRoute: solo para rutas que requieren login
function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token
    ? children
    : <Navigate to="/login" replace />;
}

// PublicRoute: solo para rutas públicas (login/register)
function PublicRoute({ children }) {
  const { token } = useAuth();
  return token
    ? <Navigate to="/app" replace />
    : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas: si hay token van a /app */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Rutas privadas: solo si hay token */}
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <Workspace />
              </PrivateRoute>
            }
          />

          {/* Redirige cualquier otra ruta a /app (o a /login si no hay token) */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
