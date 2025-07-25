import React from 'react';
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

function App() {
  const { user, loading } = useAuth();

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
