import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-happyfox-light px-4 py-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col items-center">
          <img src="/happyfox-logo.png" alt="HappyFox Logo" className="w-16 h-16 mb-2 animate-fade-in" />
          <h2 className="mt-2 text-center text-2xl font-bold text-happyfox-orange">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              name="username"
              type="text"
              required
              className="block w-full px-4 py-3 border border-happyfox-orange/40 placeholder-happyfox-dark text-happyfox-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              required
              className="block w-full px-4 py-3 border border-happyfox-orange/40 placeholder-happyfox-dark text-happyfox-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-white font-semibold bg-happyfox-orange hover:bg-happyfox-dark transition disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="text-center mt-2">
            <Link
              to="/register"
              className="text-happyfox-orange hover:text-happyfox-dark font-medium"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
