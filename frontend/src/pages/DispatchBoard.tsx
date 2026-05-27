import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Info,
  Plus,
  X,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import api from '../api/client';

interface Load {
  id: string;
  origin: string;
  destination: string;
  pickup_date: string;
  delivery_date: string;
  rate: number;
  weight: number;
  equipment_type: string;
  broker_name: string;
  status: 'available' | 'booked' | 'completed';
}

const DispatchBoard: React.FC = () => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLoad, setNewLoad] = useState({
    origin: '',
    destination: '',
    pickup_date: '',
    delivery_date: '',
    rate: '',
    weight: '',
    equipment_type: 'Dry Van',
    broker_name: ''
  });

  const fetchLoads = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dispatch/loads');
      setLoads(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching loads:', err);
      setError('Failed to load dispatch board. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  const handleAddLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loadToPost = {
        ...newLoad,
        rate: parseFloat(newLoad.rate),
        weight: parseFloat(newLoad.weight)
      };
      await api.post('/dispatch/loads', loadToPost);
      setIsModalOpen(false);
      setNewLoad({
        origin: '',
        destination: '',
        pickup_date: '',
        delivery_date: '',
        rate: '',
        weight: '',
        equipment_type: 'Dry Van',
        broker_name: ''
      });
      fetchLoads();
    } catch (err) {
      console.error('Error adding load:', err);
      alert('Failed to add load. Please check your inputs.');
    }
  };

  const updateLoadStatus = async (id: string, status: string) => {
    try {
      await api.put(`/dispatch/loads/${id}`, { status });
      fetchLoads();
    } catch (err) {
      console.error('Error updating load status:', err);
      alert('Failed to update load status.');
    }
  };

  const filteredLoads = loads.filter(load => {
    const matchesOrigin = load.origin.toLowerCase().includes(originSearch.toLowerCase());
    const matchesDest = load.destination.toLowerCase().includes(destSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || load.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      load.broker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.id.includes(searchTerm);
    
    return matchesOrigin && matchesDest && matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dispatch Board</h1>
          <p className="text-gray-600 mt-1">Manage and book freight for your fleet.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Add New Load
        </button>
      </div>

      {/* Find Loads Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Find Loads</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Origin City"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={originSearch}
              onChange={(e) => setOriginSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Destination City"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={destSearch}
              onChange={(e) => setDestSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="available">Available Only</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Keyword / ID"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Fetching the latest loads...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-8 rounded-xl text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={fetchLoads}
            className="mt-4 text-primary font-bold hover:underline"
          >
            Try Again
          </button>
        </div>
      ) : filteredLoads.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-dashed border-gray-300 text-center">
          <p className="text-gray-500 text-lg">No loads found. Try adjusting your filters or add a new load.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredLoads.map((load) => (
            <div 
              key={load.id} 
              className={`bg-white rounded-xl shadow-sm border ${
                load.status === 'completed' ? 'border-gray-100 opacity-75' : 'border-gray-200 hover:border-primary'
              } transition-all overflow-hidden`}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* Route Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">ID: {load.id.substring(0, 8)}</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        load.status === 'available' ? 'bg-green-100 text-green-700' : 
                        load.status === 'booked' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {load.status}
                      </span>
                    </div>
                    
                    <div className="flex items-start gap-8">
                      <div className="flex flex-col items-center">
                        <div className="h-4 w-4 rounded-full border-2 border-primary bg-white"></div>
                        <div className="w-0.5 h-10 bg-gray-200 my-1"></div>
                        <MapPin className="h-5 w-5 text-accent" />
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{load.origin}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {new Date(load.pickup_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{load.destination}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {new Date(load.delivery_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Load Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-col lg:items-end gap-4 lg:gap-2 lg:min-w-[180px]">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Rate</p>
                      <p className="text-xl font-bold text-primary">${load.rate.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Weight</p>
                      <p className="text-base font-semibold text-gray-700">{load.weight.toLocaleString()} lbs</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Broker</p>
                      <p className="text-sm font-medium text-gray-600">{load.broker_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Type</p>
                      <p className="text-sm font-medium text-gray-600">{load.equipment_type}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col justify-end gap-2 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 min-w-[140px]">
                    {load.status === 'available' && (
                      <button 
                        onClick={() => updateLoadStatus(load.id, 'booked')}
                        className="flex-1 lg:flex-none bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-800 transition-all"
                      >
                        Book Load
                      </button>
                    )}
                    {load.status === 'booked' && (
                      <button 
                        onClick={() => updateLoadStatus(load.id, 'completed')}
                        className="flex-1 lg:flex-none bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-teal-700 transition-all flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Complete
                      </button>
                    )}
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 flex items-center justify-center gap-2 font-medium text-sm">
                      <Info className="h-4 w-4" /> Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Load Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-gray-900">Add New Load listing</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleAddLoad} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Origin City/State</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="e.g. Chicago, IL"
                    value={newLoad.origin}
                    onChange={(e) => setNewLoad({...newLoad, origin: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Destination City/State</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="e.g. Atlanta, GA"
                    value={newLoad.destination}
                    onChange={(e) => setNewLoad({...newLoad, destination: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Pickup Date</label>
                  <input
                    required
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={newLoad.pickup_date}
                    onChange={(e) => setNewLoad({...newLoad, pickup_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Delivery Date</label>
                  <input
                    required
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={newLoad.delivery_date}
                    onChange={(e) => setNewLoad({...newLoad, delivery_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Rate ($)</label>
                  <input
                    required
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="2500"
                    value={newLoad.rate}
                    onChange={(e) => setNewLoad({...newLoad, rate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Weight (lbs)</label>
                  <input
                    required
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="40000"
                    value={newLoad.weight}
                    onChange={(e) => setNewLoad({...newLoad, weight: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Equipment Type</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={newLoad.equipment_type}
                    onChange={(e) => setNewLoad({...newLoad, equipment_type: e.target.value})}
                  >
                    <option>Dry Van</option>
                    <option>Reefer</option>
                    <option>Flatbed</option>
                    <option>Step Deck</option>
                    <option>Power Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Broker Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="e.g. TQL, Landstar"
                    value={newLoad.broker_name}
                    onChange={(e) => setNewLoad({...newLoad, broker_name: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-primary/20"
                >
                  Create Load
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatchBoard;
