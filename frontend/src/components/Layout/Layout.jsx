import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-happyfox-light">
      <Navbar />
      <div className="flex flex-col sm:flex-row">
        <Sidebar />
        <main className="flex-1 p-3 sm:p-6 bg-white rounded-t-3xl sm:rounded-none shadow-md sm:shadow-none mt-2 sm:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
