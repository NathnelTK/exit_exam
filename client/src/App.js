import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [customization, setCustomization] = useState(() => {
    const saved = localStorage.getItem('customization');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      primaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      layout: 'grid'
    };
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('customization', JSON.stringify(customization));
    // Apply customization
    document.documentElement.style.setProperty('--primary-color', customization.primaryColor);
    document.documentElement.style.setProperty('--background-color', customization.backgroundColor);
    document.body.className = customization.theme;
  }, [customization]);

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard token={token} customization={customization} />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings 
                token={token} 
                customization={customization} 
                setCustomization={setCustomization}
                setToken={setToken}
              />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

