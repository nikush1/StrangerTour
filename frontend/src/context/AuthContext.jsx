import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('st_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('st_token');
    if (token && !user) {
      authAPI
        .me()
        .then((res) => setUser(res.data))
        .catch(async () => {
          localStorage.removeItem('st_token');
          localStorage.removeItem('st_user');
          try {
            const response = await authAPI.guestLogin();
            localStorage.setItem('st_token', response.data.token);
            localStorage.setItem('st_user', JSON.stringify(response.data.user));
            setUser(response.data.user);
          } catch (guestError) {
            console.error('Guest login failed', guestError);
          }
        });
    }
    if (!token && !user) {
      authAPI.guestLogin()
        .then((response) => {
          localStorage.setItem('st_token', response.data.token);
          localStorage.setItem('st_user', JSON.stringify(response.data.user));
          setUser(response.data.user);
        })
        .catch((error) => {
          console.error('Guest login failed', error);
        });
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    const response = await authAPI.login(credentials);
    localStorage.setItem('st_token', response.data.token);
    localStorage.setItem('st_user', JSON.stringify(response.data.user));
    setUser(response.data.user);
    setLoading(false);
  };

  const register = async (payload) => {
    setLoading(true);
    const response = await authAPI.register(payload);
    localStorage.setItem('st_token', response.data.token);
    localStorage.setItem('st_user', JSON.stringify(response.data.user));
    setUser(response.data.user);
    setLoading(false);
  };

  const googleLogin = async (tokenId) => {
    setLoading(true);
    const response = await authAPI.googleLogin(tokenId);
    localStorage.setItem('st_token', response.data.token);
    localStorage.setItem('st_user', JSON.stringify(response.data.user));
    setUser(response.data.user);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('st_token');
    localStorage.removeItem('st_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
