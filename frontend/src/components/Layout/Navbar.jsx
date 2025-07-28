import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-happyfox-orange shadow-sm border-b border-happyfox-dark sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="/happyfox-white-logo.png" alt="HappyFox Logo" className="w-8 h-8 mr-2 hidden sm:block" />
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              HappyFox Feedback
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-happyfox-light px-2 py-1 rounded-full">
              <User className="h-5 w-5 text-happyfox-dark" />
              <span className="text-xs sm:text-sm text-happyfox-dark font-medium">
                {user?.first_name || user?.username}
              </span>
              <span className="px-2 py-1 text-xs bg-happyfox-orange text-white rounded-full">
                {user?.role}
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-1 px-2 sm:px-3 py-2 text-xs sm:text-sm text-white bg-red-500 hover:bg-red-700 transition rounded-md"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
