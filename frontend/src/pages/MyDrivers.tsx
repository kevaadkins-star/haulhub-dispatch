import React, { useState, useEffect } from 'react';
import { 
  User, 
  Search, 
  MessageSquare, 
  Loader2, 
  Truck,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Driver {
  id: string;
  full_name: string;
  email: string;
  dot_number: string;
  mc_number: string;
  status: string;
}

const MyDrivers: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.role !== 'dispatcher') {
      navigate('/dashboard');
      return;
    }
    fetchDrivers();
  }, [user]);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dispatchers/my-drivers');
      setDrivers(res.data);
    } catch (err) {
      console.error('Error fetching my drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver => 
    driver.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.dot_number?.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Managed Fleet</h1>
          <p className="text-gray-600 mt-1">Monitor and support your assigned owner-operators and drivers.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          <div className="h-10 w-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold">
            {drivers.length}
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Drivers</p>
            <p className="text-sm font-bold text-gray-700">Assignments</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by driver name, email, or DOT..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading your fleet...</p>
        </div>
      ) : drivers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <User className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">You don't have any assigned drivers yet.</p>
          <p className="text-sm text-gray-400 mt-2">Requests from drivers will appear in your messages.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => (
            <div key={driver.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                      <User className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{driver.full_name}</h3>
                      <p className="text-xs text-gray-500">{driver.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-full border border-green-100">
                    {driver.status}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 font-medium flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> USDOT
                    </span>
                    <span className="font-bold text-gray-700">{driver.dot_number || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 font-medium flex items-center gap-2">
                      <Truck className="h-4 w-4" /> MC Number
                    </span>
                    <span className="font-bold text-gray-700">{driver.mc_number || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Current Load</p>
                    <p className="text-xs font-bold text-gray-600 truncate">Chicago → Atlanta</p>
                  </div>
                  <div className="flex-1 p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">HOS Status</p>
                    <p className="text-xs font-bold text-green-600 uppercase">Driving</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-gray-50 flex items-center justify-between">
                <button 
                  onClick={() => navigate('/messages')}
                  className="flex items-center gap-2 text-primary font-bold hover:underline"
                >
                  <MessageSquare className="h-4 w-4" /> Message
                </button>
                <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                  Details <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDrivers;
