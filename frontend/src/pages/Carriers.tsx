import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Truck, 
  ShieldCheck, 
  Loader2,
  ChevronRight,
  MessageSquare,
  X,
  Plus
} from 'lucide-react';
import api from '../api/client';

interface Carrier {
  id: string;
  company_name: string;
  dot_number: string;
  mc_number: string;
  contact_phone: string;
  contact_email: string;
  lease_terms: string;
  verified: number;
}

const Carriers: React.FC = () => {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newCarrier, setNewCarrier] = useState({
    company_name: '',
    dot_number: '',
    mc_number: '',
    contact_phone: '',
    contact_email: '',
    lease_terms: ''
  });

  useEffect(() => {
    fetchCarriers();
  }, []);

  const fetchCarriers = async (search = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/carriers${search ? `?search=${search}` : ''}`);
      setCarriers(res.data);
    } catch (err) {
      console.error('Error fetching carriers:', err);
      // Fallback mock data if API fails
      setCarriers([
        {
          id: '1',
          company_name: 'FastLane Logistics',
          dot_number: '1234567',
          mc_number: 'MC987654',
          contact_phone: '555-0101',
          contact_email: 'dispatch@fastlane.com',
          lease_terms: '80/20 split, fuel card, trailer provided.',
          verified: 1
        },
        {
          id: '2',
          company_name: 'Blue Trucking Co',
          dot_number: '7654321',
          mc_number: 'MC123456',
          contact_phone: '555-0202',
          contact_email: 'hiring@bluetrucking.com',
          lease_terms: 'Owner-operators only. Weekly settlements.',
          verified: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCarriers(searchTerm);
  };

  const handleContactCarrier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarrier) return;

    try {
      await api.post('/carriers/contact', {
        carrier_id: selectedCarrier.id,
        message: contactMessage
      });
      alert('Contact request sent successfully!');
      setIsContactModalOpen(false);
      setContactMessage('');
    } catch (err) {
      console.error('Error contacting carrier:', err);
      alert('Failed to send contact request.');
    }
  };

  const handleRegisterCarrier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/carriers', newCarrier);
      alert('Carrier registered successfully! It will be reviewed by our team.');
      setIsRegisterModalOpen(false);
      setNewCarrier({
        company_name: '',
        dot_number: '',
        mc_number: '',
        contact_phone: '',
        contact_email: '',
        lease_terms: ''
      });
      fetchCarriers();
    } catch (err) {
      console.error('Error registering carrier:', err);
      alert('Failed to register carrier. Please check your inputs.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Carrier Network</h1>
          <p className="text-gray-600 mt-1">Connect with vetted carriers and explore lease-on opportunities.</p>
        </div>
        <button 
          onClick={() => setIsRegisterModalOpen(true)}
          className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Register My Carrier
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by carrier name..."
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
          <p className="text-gray-500 font-medium">Loading carrier network...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {carriers.map((carrier) => (
            <div key={carrier.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900">{carrier.company_name}</h3>
                    {carrier.verified === 1 && <ShieldCheck className="h-5 w-5 text-blue-500" />}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <p className="text-sm text-gray-500"><strong>DOT:</strong> {carrier.dot_number} {carrier.mc_number && `| MC: ${carrier.mc_number}`}</p>
                  <p className="text-sm text-gray-600 line-clamp-3">{carrier.lease_terms || 'No lease terms provided.'}</p>
                </div>

                <div className="flex gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1"><Truck className="h-4 w-4" /> Fleet Carrier</div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-gray-50 flex items-center justify-between">
                <button 
                  onClick={() => {
                    setSelectedCarrier(carrier);
                    setIsContactModalOpen(true);
                  }}
                  className="flex items-center gap-2 text-primary font-bold hover:underline"
                >
                  <MessageSquare className="h-4 w-4" /> Contact
                </button>
                <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                  Details <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {carriers.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No carriers found matching your search.</p>
          <button 
            onClick={() => { setSearchTerm(''); fetchCarriers(''); }}
            className="mt-4 text-primary font-bold hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Contact Modal */}
      {isContactModalOpen && selectedCarrier && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-gray-900">Contact {selectedCarrier.company_name}</h2>
              <button onClick={() => setIsContactModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleContactCarrier} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Tell them about your interest in leasing on..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsContactModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-gray-900">Register Your Carrier</h2>
              <button onClick={() => setIsRegisterModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleRegisterCarrier} className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Company Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={newCarrier.company_name}
                    onChange={(e) => setNewCarrier({...newCarrier, company_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">DOT Number</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={newCarrier.dot_number}
                    onChange={(e) => setNewCarrier({...newCarrier, dot_number: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">MC Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={newCarrier.mc_number}
                    onChange={(e) => setNewCarrier({...newCarrier, mc_number: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={newCarrier.contact_phone}
                    onChange={(e) => setNewCarrier({...newCarrier, contact_phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Contact Email</label>
                  <input
                    required
                    type="email"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={newCarrier.contact_email}
                    onChange={(e) => setNewCarrier({...newCarrier, contact_email: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Lease Terms Summary</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="e.g. 85/15 split, fuel card provided, insurance included..."
                    value={newCarrier.lease_terms}
                    onChange={(e) => setNewCarrier({...newCarrier, lease_terms: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-primary/20"
                >
                  Register Carrier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carriers;
