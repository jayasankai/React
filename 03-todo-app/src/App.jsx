import { useState } from 'react';
import Login from './components/Login/Login.jsx';
import TodoPage from './components/Todo/TodoPage.jsx';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => setUser(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <TodoPage user={user} onLogout={handleLogout} />;
}

export default App;
