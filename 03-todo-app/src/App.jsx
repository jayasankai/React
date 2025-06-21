import { useState, useEffect } from 'react';
import Login from './components/Login/Login.jsx';
import TodoPage from './components/Todo/TodoPage.jsx';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Check sessionStorage for token and user on mount
  useEffect(() => {
    const token = sessionStorage.getItem('jwt_token');
    const userStr = sessionStorage.getItem('jwt_user');
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
  }, []);

  const handleLogin = (userData) => {
    setUser(userData.user);
    setToken(userData.token);
    // Save to sessionStorage for persistence
    if (userData.token) sessionStorage.setItem('jwt_token', userData.token);
    if (userData.user) sessionStorage.setItem('jwt_user', JSON.stringify(userData.user));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('jwt_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return <TodoPage user={user} token={token} onLogout={handleLogout} />;
}

export default App;
