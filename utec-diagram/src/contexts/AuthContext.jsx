import { createContext, useContext, useState, useEffect } from 'react';

const AuthCtx = createContext();
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);


  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) setToken(saved);
  }, []);

  const login = newToken => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };


  return (
    <AuthCtx.Provider value={{ token, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

