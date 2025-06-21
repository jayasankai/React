import { useEffect, useState } from 'react';

function TodoPage({ user }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Fetch todos from backend
  useEffect(() => {
    if (user) {
      fetch('http://localhost:8000/api/todos', { credentials: 'include' })
        .then(res => res.json())
        .then(setTodos);
    }
  }, [user]);

  // Add todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const res = await fetch('http://localhost:8000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title: newTodo })
    });
    const todo = await res.json();
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await fetch(`http://localhost:8000/api/todos/${id}`, { method: 'DELETE', credentials: 'include' });
    setTodos(todos.filter(t => t.id !== id));
  };

  // Start editing
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  // Save edit
  const saveEdit = async (id) => {
    await fetch(`http://localhost:8000/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title: editingTitle })
    });
    setTodos(todos.map(t => t.id === id ? { ...t, title: editingTitle } : t));
    setEditingId(null);
    setEditingTitle('');
  };

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <form onSubmit={addTodo} className="todo-form">
        <input
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            {editingId === todo.id ? (
              <>
                <input
                  value={editingTitle}
                  onChange={e => setEditingTitle(e.target.value)}
                />
                <button onClick={() => saveEdit(todo.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{todo.title}</span>
                <button onClick={() => startEdit(todo)}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoPage;
