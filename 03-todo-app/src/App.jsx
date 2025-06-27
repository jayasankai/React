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
    // Check for bypass-auth in URL
    const url = new URL(window.location.href);
    const bypassAuth = url.searchParams.get('user') === 'bypass-auth' || url.hash.includes('bypass-auth');
    if (bypassAuth) {
      // Set mock user and token
      const mockUser = { username: 'bypass-auth', name: 'Bypass User' };
      setUser(mockUser);
      setToken('bypass-token');
      setBypassAuthActive(true);
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('jwt_token');
    const userStr = localStorage.getItem('jwt_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        // Optionally, check token expiration here
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
