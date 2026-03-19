import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, ChevronRight, MessageSquare, LayoutTemplate, LogOut, LayoutDashboard } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

// Placeholder Pages
import BulkSend from './BulkSend';
import Contacts from './Contacts';
import Templates from './Templates';
import Campaigns from './Campaigns';

const Dashboard = () => {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Bulk Send', path: '/dashboard', icon: <Send size={20} />, exact: true },
    { label: 'Campaigns', path: '/dashboard/campaigns', icon: <MessageSquare size={20} /> },
    { label: 'Contacts', path: '/dashboard/contacts', icon: <Users size={20} /> },
    { label: 'Templates', path: '/dashboard/templates', icon: <LayoutTemplate size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-whatsapp-light flex items-center justify-center text-white font-bold">
                W
            </div>
            <h1 className="text-xl font-bold text-gray-800">Bulk SMS</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);
                
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-whatsapp-bg text-whatsapp-darker font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-800 mb-1 truncate px-2">{user?.email}</div>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
                <LogOut size={18} />
                Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <Routes>
          <Route path="/" element={<BulkSend />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/campaigns" element={<Campaigns />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
