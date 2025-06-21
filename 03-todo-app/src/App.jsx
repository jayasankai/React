import { useState } from 'react';
import Login from './components/Login/Login.jsx';
import TodoPage from './components/Todo/TodoPage.jsx';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData.user);
    setToken(userData.token);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return <TodoPage user={user} token={token} onLogout={handleLogout} />;
}

export default App;
