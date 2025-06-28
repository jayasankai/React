import { useState, useEffect } from 'react';
import Login from './components/Login/Login.jsx';
import TodoPage from './components/Todo/TodoPage.jsx';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [bypassAuthActive, setBypassAuthActive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check localStorage for token and user on mount
  useEffect(() => {
    // Only allow /auth-todos path to bypass login
    const url = new URL(window.location.href);
    if (url.pathname === '/auth-todos') {
      const mockUser = { username: 'auth-todos', name: 'Auth Todos User' };
      setUser(mockUser);
      setToken('auth-todos-token');
      setBypassAuthActive(true);
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('jwt_token');
    const userStr = localStorage.getItem('jwt_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setUser(user);
        setToken(token);
      } catch (e) {
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    if (userData.user && userData.user.username === 'bypass-auth') {
      setUser(userData.user);
      setToken('bypass-token');
      setBypassAuthActive(true);
      return;
    }
    setUser(userData.user);
    setToken(userData.token);
    // Save to localStorage for persistence
    if (userData.token) localStorage.setItem('jwt_token', userData.token);
    if (userData.user) localStorage.setItem('jwt_user', JSON.stringify(userData.user));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setBypassAuthActive(false);
    if (!bypassAuthActive) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('jwt_user');
    }
  };

  if (loading) {
    return null; // or a loading spinner if you prefer
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return <TodoPage user={user} token={token} onLogout={handleLogout} />;
}

export default App;
