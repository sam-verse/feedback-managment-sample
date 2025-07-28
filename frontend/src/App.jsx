import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import Boards from './views/Boards';
import FeedbackView from './views/FeedbackView';
import KanbanView from './views/KanbanView';
import Dashboard from './views/Dashboard';
import Loading from './components/Common/Loading';

function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-happyfox-light animate-fade-in px-4">
      <img
        src="/happyfox-logo.png"
        alt="HappyFox Logo"
        className="w-24 h-24 sm:w-32 sm:h-32 mb-4 drop-shadow-lg animate-fade-in"
      />
      <h1 className="text-2xl sm:text-3xl font-bold text-happyfox-orange tracking-wide text-center animate-fade-in delay-200">
        Welcome to HappyFox Feedback
      </h1>
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

        {user ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="boards" element={<Boards />} />
            <Route path="feedback" element={<FeedbackView />} />
            <Route path="kanban" element={<KanbanView />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
