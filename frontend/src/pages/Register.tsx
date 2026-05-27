import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Mail, Lock, User, Loader2, ClipboardCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'owner_operator', // 'owner_operator' or 'lease_driver'
    dotNumber: '',
    mcNumber: '',
    tier: 'basic', // 'basic' or 'premium'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: formData.email,
        full_name: formData.name,
        role: formData.role as 'owner_operator' | 'lease_driver',
        dot_number: formData.dotNumber,
        mc_number: formData.mcNumber,
        subscription_tier: formData.tier as 'basic' | 'premium',
      };
      login('mock_token_' + Date.now(), mockUser);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <Truck className="h-10 w-10 text-primary" />
          <span className="text-3xl font-bold text-slate-900 tracking-tight">HaulHub</span>
        </Link>
        <h2 className="text-3xl font-extrabold text-gray-900">
          Start your journey
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          The all-in-one platform for dispatch and compliance.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-10 px-8 shadow-xl rounded-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Role Radio buttons as requested by lead */}
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">Your Role</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`cursor-pointer flex items-center p-4 rounded-xl border transition-all ${formData.role === 'owner_operator' ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="owner_operator"
                    checked={formData.role === 'owner_operator'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${formData.role === 'owner_operator' ? 'border-primary' : 'border-gray-300'}`}>
                    {formData.role === 'owner_operator' && <div className="h-3 w-3 rounded-full bg-primary" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Owner-Operator</p>
                    <p className="text-xs text-gray-500">I have my own DOT/MC authority</p>
                  </div>
                </label>
                <label className={`cursor-pointer flex items-center p-4 rounded-xl border transition-all ${formData.role === 'lease_driver' ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="lease_driver"
                    checked={formData.role === 'lease_driver'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${formData.role === 'lease_driver' ? 'border-primary' : 'border-gray-300'}`}>
                    {formData.role === 'lease_driver' && <div className="h-3 w-3 rounded-full bg-primary" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Lease Driver</p>
                    <p className="text-xs text-gray-500">I want to lease onto a carrier</p>
                  </div>
                </label>
              </div>
            </div>

            {formData.role === 'owner_operator' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-1">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">DOT Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClipboardCheck className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      name="dotNumber"
                      type="text"
                      required={formData.role === 'owner_operator'}
                      value={formData.dotNumber}
                      onChange={handleChange}
                      className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="1234567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">MC Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClipboardCheck className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      name="mcNumber"
                      type="text"
                      required={formData.role === 'owner_operator'}
                      value={formData.mcNumber}
                      onChange={handleChange}
                      className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="123456"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Tier Selector as requested by lead */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Subscription Tier</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`cursor-pointer flex flex-col p-4 rounded-xl border transition-all ${formData.tier === 'basic' ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="tier"
                    value="basic"
                    checked={formData.tier === 'basic'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">Basic</span>
                    <span className="text-primary font-bold">$99/mo</span>
                  </div>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" /> Load matching</li>
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" /> HOS tracking</li>
                  </ul>
                </label>
                <label className={`cursor-pointer flex flex-col p-4 rounded-xl border transition-all ${formData.tier === 'premium' ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="tier"
                    value="premium"
                    checked={formData.tier === 'premium'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">Premium</span>
                    <span className="text-primary font-bold">$199/mo</span>
                  </div>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" /> Priority dispatch</li>
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" /> Full FMCSA support</li>
                  </ul>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  'Create My Account'
                )}
              </button>
            </div>
            
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
