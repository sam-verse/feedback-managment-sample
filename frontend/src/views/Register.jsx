import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirm) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      toast.success('Registration successful!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
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
            Create your account
          </h2>
        </div>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="first_name"
                type="text"
                className="block w-full px-4 py-3 border border-happyfox-orange/40 placeholder-happyfox-dark text-happyfox-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
              />
              <input
                name="last_name"
                type="text"
                className="block w-full px-4 py-3 border border-happyfox-orange/40 placeholder-happyfox-dark text-happyfox-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
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
              name="email"
              type="email"
              required
              className="block w-full px-4 py-3 border border-happyfox-orange/40 placeholder-happyfox-dark text-happyfox-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
              placeholder="Email"
              value={formData.email}
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
            <input
              name="password_confirm"
              type="password"
              required
              className="block w-full px-4 py-3 border border-happyfox-orange/40 placeholder-happyfox-dark text-happyfox-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-happyfox-orange focus:border-happyfox-orange bg-happyfox-light"
              placeholder="Confirm Password"
              value={formData.password_confirm}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-white font-semibold bg-happyfox-orange hover:bg-happyfox-dark transition disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <div className="text-center mt-2">
            <Link
              to="/login"
              className="text-happyfox-orange hover:text-happyfox-dark font-medium"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
