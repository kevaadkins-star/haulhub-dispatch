import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  ShieldCheck, 
  Truck, 
  User, 
  Settings,
  LogOut,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'Dispatch Board', icon: ClipboardList, path: '/dispatch' },
    { name: 'Compliance', icon: ShieldCheck, path: '/compliance' },
    { name: 'Carriers', icon: Truck, path: '/carriers' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  // Conditional items based on role
  if (user?.role === 'dispatcher') {
    navItems.splice(2, 0, { name: 'My Drivers', icon: User, path: '/my-drivers' });
  } else {
    navItems.splice(2, 0, { name: 'Find a Dispatcher', icon: User, path: '/dispatchers' });
  }

  return (
    <aside className="bg-slate-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold text-accent">HaulHub Menu</h2>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive 
                      ? 'bg-primary text-white border-r-4 border-accent' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-6 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors rounded-md"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
