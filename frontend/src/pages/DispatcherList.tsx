import React, { useState, useEffect } from 'react';
import { 
  User, 
  Search, 
  Star, 
  MessageSquare, 
  UserPlus, 
  Loader2, 
  X,
  ShieldCheck
} from 'lucide-react';
import api from '../api/client';

interface Dispatcher {
  id: string;
  full_name: string;
  email: string;
  bio: string;
  rating: number;
}

const DispatcherList: React.FC = () => {
  const [dispatchers, setDispatchers] = useState<Dispatcher[]>([]);
  const [myDispatcher, setMyDispatcher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedDispatcher, setSelectedDispatcher] = useState<Dispatcher | null>(null);
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    fetchDispatchers();
    fetchMyDispatcher();
  }, []);

  const fetchDispatchers = async (name = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/dispatchers${name ? `?name=${name}` : ''}`);
      setDispatchers(res.data);
    } catch (err) {
      console.error('Error fetching dispatchers:', err);
      // Fallback mock
      setDispatchers([
        {
          id: 'd1',
          full_name: 'Sarah Miller',
          email: 'sarah@haulhub.com',
          bio: 'Specializing in flatbed and reefer loads. 5 years experience managing owner-operators.',
          rating: 4.9
        },
        {
          id: 'd2',
          full_name: 'John Davis',
          email: 'john@haulhub.com',
          bio: 'Dry van expert. I focus on high-RPM loads and efficient routing to keep your trucks moving.',
          rating: 4.7
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyDispatcher = async () => {
    try {
      const res = await api.get('/dispatchers/my-dispatcher');
      setMyDispatcher(res.data);
    } catch (err) {
      if ((err as any).response?.status !== 404) {
        console.error('Error fetching my dispatcher:', err);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDispatchers(searchTerm);
  };

  const handleRequestDispatcher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispatcher) return;

    try {
      await api.post('/dispatchers/request', {
        dispatcher_id: selectedDispatcher.id,
        message: requestMessage
      });
      alert('Request sent successfully!');
      setIsRequestModalOpen(false);
      setRequestMessage('');
    } catch (err) {
      console.error('Error requesting dispatcher:', err);
      alert('Failed to send request.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dispatcher Network</h1>
        <p className="text-gray-600 mt-1">Find professional dispatchers to help manage your loads and maximize revenue.</p>
      </div>

      {myDispatcher && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
              <User className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Your Active Dispatcher</p>
              <h2 className="text-2xl font-bold text-gray-900">{myDispatcher.full_name}</h2>
              <p className="text-sm text-gray-500">{myDispatcher.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
              <MessageSquare className="h-4 w-4" /> Message
            </button>
            <button className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-md shadow-primary/20">
              View Profile
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search dispatchers by name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition-colors">
          Search
        </button>
      </form>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading dispatcher network...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dispatchers.map((dispatcher) => (
            <div key={dispatcher.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{dispatcher.full_name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-gray-600">{dispatcher.rating}</span>
                      </div>
                    </div>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                </div>

                <p className="text-sm text-gray-500 line-clamp-3 mb-6 leading-relaxed">
                  {dispatcher.bio}
                </p>

                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-4">
                  <span>50+ Loads/mo</span>
                  <span>USA & Canada</span>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-gray-50 flex items-center justify-between">
                <button 
                  onClick={() => {
                    setSelectedDispatcher(dispatcher);
                    setIsRequestModalOpen(true);
                  }}
                  className="flex items-center gap-2 text-primary font-bold hover:underline"
                >
                  <UserPlus className="h-4 w-4" /> Request Service
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      {isRequestModalOpen && selectedDispatcher && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-gray-900">Request {selectedDispatcher.full_name}</h2>
              <button onClick={() => setIsRequestModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleRequestDispatcher} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Introductory Message</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Tell them about your fleet and what you're looking for..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsRequestModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatcherList;
