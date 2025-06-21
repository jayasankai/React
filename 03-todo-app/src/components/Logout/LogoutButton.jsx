import React from 'react';
import './LogoutButton.css';

function LogoutButton({ onLogout }) {
  return (
    <button className="logout-btn" onClick={onLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;
