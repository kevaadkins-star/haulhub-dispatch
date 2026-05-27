import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Truck, 
  Bell, 
  Mail,
  Phone,
  Camera,
  Loader2,
  CheckCircle2,
  Lock,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'fleet' | 'notifications' | 'subscription'>('profile');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: '(555) 012-3456',
    company_name: 'Independent Owner-Operator',
    dot_number: user?.dot_number || '',
    mc_number: user?.mc_number || '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/user/profile', formData);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your personal information, fleet details, and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:w-64 flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <User className="h-5 w-5" /> Personal Profile
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'subscription' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <CreditCard className="h-5 w-5" /> Subscription
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'account' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Lock className="h-5 w-5" /> Account Security
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'fleet' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Truck className="h-5 w-5" /> Fleet & Authority
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'notifications' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Bell className="h-5 w-5" /> Notifications
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {activeTab === 'profile' && (
              <div className="p-8">
                <div className="flex items-center gap-6 mb-10">
                  <div className="relative group">
                    <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                      <User className="h-12 w-12 text-slate-300" />
                    </div>
                    <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{user?.full_name}</h2>
                    <p className="text-gray-500 capitalize">{user?.role?.replace('-', ' ')} • {user?.subscription_tier} Member</p>
                  </div>
                </div>

                {successMessage && (
                  <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-5 w-5" /> {successMessage}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          value={formData.full_name}
                          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          value={formData.company_name}
                          onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Subscription Details</h3>
                <div className="bg-slate-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Current Plan</p>
                      <h4 className="text-2xl font-bold text-gray-900 capitalize">{user?.subscription_tier} Plan</h4>
                      <p className="text-sm text-gray-500">Your subscription renews on June 28, 2026.</p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase">Active</span>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {[
                      'Unlimited load searches',
                      'Direct dispatcher messaging',
                      'Compliance monitoring tools',
                      'Verified authority badge'
                    ].map(benefit => (
                      <div key={benefit} className="flex items-center gap-3 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-green-500" /> {benefit}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <button className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-all">
                      Upgrade Plan
                    </button>
                    <button className="flex-1 bg-white border border-gray-200 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">
                      Billing History
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fleet' && (
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Fleet & Authority Information</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">USDOT Number</label>
                      <input
                        type="text"
                        disabled
                        className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                        value={formData.dot_number}
                      />
                      <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase">Locked: Verified Authority</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">MC Number</label>
                      <input
                        type="text"
                        disabled
                        className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                        value={formData.mc_number}
                      />
                    </div>
                  </div>
                  
                  <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900">Verified Authority</h4>
                      <p className="text-sm text-blue-700 mt-1">Your DOT/MC authority has been verified and is currently in good standing with the FMCSA.</p>
                      <button className="mt-4 text-sm font-bold text-primary hover:underline">View Public Profile</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'account' && (
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
                <div className="space-y-8">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Change Password</h4>
                    <div className="grid grid-cols-1 gap-4 max-w-md">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <button className="bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all">
                        Update Password
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-gray-100">
                    <h4 className="font-bold text-red-600 mb-4">Danger Zone</h4>
                    <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <button className="border-2 border-red-600 text-red-600 px-6 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
                <div className="space-y-6">
                  {[
                    { title: 'New Load Alerts', desc: 'Get notified when loads matching your preferences are posted.' },
                    { title: 'Compliance Reminders', desc: 'Alerts for HOS limits and upcoming vehicle inspections.' },
                    { title: 'Broker Messages', desc: 'Direct messages from brokers regarding your booked loads.' },
                    { title: 'Payment Updates', desc: 'Status updates on your factorable loads and payouts.' }
                  ].map((item, i) => (
                    <div key={item.title} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg text-primary shadow-sm">
                          <Bell className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
