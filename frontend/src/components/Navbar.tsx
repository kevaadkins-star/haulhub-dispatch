import React from 'react';
import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="bg-primary text-white py-4 px-6 flex justify-between items-center shadow-md">
      <Link to="/" className="flex items-center gap-2">
        <Truck className="h-8 w-8 text-accent" />
        <h1 className="text-2xl font-bold tracking-tight">HaulHub Dispatch</h1>
      </Link>
      <nav className="flex gap-6 items-center">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">Welcome, {user?.full_name}</span>
              <button 
                onClick={logout}
                className="bg-accent hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-accent transition-colors">Login</Link>
            <Link to="/register" className="bg-accent hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
              Get Started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
