import { useEffect, useState } from 'react';
import LogoutButton from '../Logout/LogoutButton.jsx';
import '../Logout/LogoutButton.css';
import './TodoPage.css';

function TodoPage({ user, onLogout, token }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingCompleted, setEditingCompleted] = useState(false);
  const [addError, setAddError] = useState('');

  // Fetch todos from backend
  useEffect(() => {
    if (user && token) {
      fetch('http://localhost:8000/api/todos', {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setTodos);
    }
  }, [user, token]);

  // Add todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      setAddError('Todo cannot be empty.');
      return;
    }
    setAddError('');
    const res = await fetch('http://localhost:8000/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({ title: newTodo })
    });
    const todo = await res.json();
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await fetch(`http://localhost:8000/api/todos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include'
    });
    setTodos(todos.filter(t => t.id !== id));
  };

  // Start editing
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
    setEditingCompleted(todo.isCompleted);
  };

  // Save edit
  const saveEdit = async (id) => {
    const body = { title: editingTitle };
    if (user.role === 'ADMIN') {
      body.isCompleted = editingCompleted;
    }
    await fetch(`http://localhost:8000/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(body)
    });
    setTodos(todos.map(t => t.id === id ? { ...t, title: editingTitle, isCompleted: user.role === 'ADMIN' ? editingCompleted : t.isCompleted } : t));
    setEditingId(null);
    setEditingTitle('');
    setEditingCompleted(false);
  };

  return (
    <div className="todo-app" id="todo-app" style={{ position: 'relative' }}>
      <LogoutButton onLogout={onLogout} />
      <h1>Todo List</h1>
      <form onSubmit={addTodo} className="todo-form">
        <input
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button id="add-button" type="submit">Add</button>
      </form>
      {addError && <div className="login-error">{addError}</div>}
      <ul className="todo-list" id="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <div className="todo-item-content" id={`todo-item-content-${todo.id}`}>
              {editingId === todo.id ? (
                <input
                  value={editingTitle}
                  onChange={e => setEditingTitle(e.target.value)}
                />
              ) : (
                <span>{todo.title}</span>
              )}
            </div>
            <div className="todo-item-actions" id={`todo-item-actions-${todo.id}`}>
              {editingId === todo.id ? (
                <>
                  {user.role === 'ADMIN' && (
                    <label style={{ marginLeft: 8 }}>
                      <input
                        id={`checkbox-${todo.id}`}
                        type="checkbox"
                        checked={editingCompleted}
                        onChange={e => setEditingCompleted(e.target.checked)}
                      />
                      Completed
                    </label>
                  )}
                  <button id={`save-button-${todo.id}`} onClick={() => saveEdit(todo.id)}>Save</button>
                  <button id={`cancel-button-${todo.id}`} onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {user.role === 'ADMIN' ? (
                    <input
                      id={`checkbox-${todo.id}`}
                      type="checkbox"
                      checked={todo.isCompleted}
                      disabled
                      style={{ marginLeft: 8 }}
                    />
                  ) : null}
                  <button id={`edit-button-${todo.id}`} onClick={() => startEdit(todo)}>Edit</button>
                  <button id={`delete-button-${todo.id}`} onClick={() => deleteTodo(todo.id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoPage;
