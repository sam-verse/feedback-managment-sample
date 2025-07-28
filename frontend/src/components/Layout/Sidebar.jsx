import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Folder,
  MessageSquare,
  Kanban,
  BarChart3
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/boards', icon: Folder, label: 'Boards' },
    { to: '/feedback', icon: MessageSquare, label: 'Feedback' },
    { to: '/kanban', icon: Kanban, label: 'Kanban' },
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  ];

  return (
    <aside className="hidden sm:block w-56 bg-happyfox-light shadow-sm border-r border-happyfox-dark min-h-screen pt-4">
      <nav>
        <div className="px-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-1 transition-colors ${
                  isActive
                    ? 'bg-happyfox-orange text-white border-r-4 border-happyfox-dark shadow-md'
                    : 'text-happyfox-dark hover:bg-happyfox-orange/20 hover:text-happyfox-orange'
                }`
              }
            >
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
