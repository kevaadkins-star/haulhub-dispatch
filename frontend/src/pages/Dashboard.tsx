import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Package, 
  AlertCircle, 
  CheckCircle2,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { name: 'Active Loads', value: '4', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Monthly Revenue', value: '$12,450', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Compliance Status', value: 'Active', icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-100' },
    { name: 'HOS Alerts', value: '0', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const quickActions = [
    { title: 'Find New Load', description: 'Search the live load board', icon: Plus, path: '/dispatch' },
    { title: 'Log Inspection', description: 'Complete a pre-trip inspection', icon: AlertCircle, path: '/compliance' },
    { title: 'Update HOS', description: 'Status: Off Duty (since 2h ago)', icon: CheckCircle2, path: '/compliance' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.full_name}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your fleet today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-start p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary transition-all text-left w-full"
              >
                <div className="p-2 bg-slate-50 rounded-lg mb-4 text-primary">
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900">{action.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                <div className="mt-4 text-primary font-medium flex items-center gap-1 text-sm">
                  Start <ArrowRight className="h-4 w-4" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <p className="text-sm text-gray-500">You haven't dispatched any loads recently.</p>
              </div>
              <div className="p-4 bg-gray-50 text-center">
                <button className="text-primary font-bold text-sm hover:underline">View All History</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar content on Dashboard */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Authority Info</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">DOT Number</p>
                <p className="font-bold text-gray-900">{user?.dot_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">MC Number</p>
                <p className="font-bold text-gray-900">{user?.mc_number || 'N/A'}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Subscription</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-bold rounded uppercase">
                    {user?.subscription_tier || 'Basic'}
                  </span>
                  <button className="text-xs text-primary hover:underline">Upgrade</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
