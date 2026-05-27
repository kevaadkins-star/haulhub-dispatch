import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  ClipboardCheck, 
  UserCheck,
  AlertTriangle,
  Loader2,
  Check
} from 'lucide-react';
import api from '../api/client';

interface HOSLog {
  date: string;
  driving_minutes: number;
  on_duty_minutes: number;
  off_duty_minutes: number;
  sleeper_minutes: number;
  status: 'compliant' | 'violation';
}

interface HOSStatus {
  driving_hours_used: number;
  on_duty_hours_used: number;
  status: 'compliant' | 'violation';
}

interface InspectionCategory {
  category: string;
  items: string[];
}

const Compliance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hos' | 'authority' | 'inspection'>('hos');
  
  // HOS State
  const [hosStatus, setHosStatus] = useState<HOSStatus | null>(null);
  const [hosHistory, setHosHistory] = useState<HOSLog[]>([]);
  const [hosLoading, setHosLoading] = useState(false);
  const [logForm, setLogForm] = useState({
    driving: '',
    onDuty: '',
    offDuty: '',
    sleeper: ''
  });

  // Authority State
  const [dotNumber, setDotNumber] = useState('');
  const [mcNumber, setMcNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);

  // Inspection State
  const [checklist, setChecklist] = useState<InspectionCategory[]>([]);
  const [checklistLoading, setChecklistLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'hos') {
      fetchHOSData();
    } else if (activeTab === 'inspection') {
      fetchChecklist();
    }
  }, [activeTab]);

  const fetchHOSData = async () => {
    setHosLoading(true);
    try {
      const [statusRes, historyRes] = await Promise.all([
        api.get('/compliance/hos/status'),
        api.get('/compliance/hos/history')
      ]);
      setHosStatus(statusRes.data);
      setHosHistory(historyRes.data);
    } catch (err) {
      console.error('Error fetching HOS data:', err);
    } finally {
      setHosLoading(false);
    }
  };

  const handleLogHOS = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/compliance/hos/log', {
        driving_minutes: parseInt(logForm.driving) || 0,
        on_duty_minutes: parseInt(logForm.onDuty) || 0,
        off_duty_minutes: parseInt(logForm.offDuty) || 0,
        sleeper_minutes: parseInt(logForm.sleeper) || 0
      });
      setLogForm({ driving: '', onDuty: '', offDuty: '', sleeper: '' });
      fetchHOSData();
      alert('HOS log submitted successfully.');
    } catch (err) {
      console.error('Error logging HOS:', err);
      alert('Failed to submit HOS log.');
    }
  };

  const handleVerifyAuthority = async () => {
    if (!dotNumber && !mcNumber) return;
    setVerifying(true);
    try {
      const res = await api.get('/compliance/verify-authority', {
        params: { dot: dotNumber, mc: mcNumber }
      });
      setVerificationResult(res.data);
    } catch (err) {
      console.error('Error verifying authority:', err);
      alert('Failed to verify authority.');
    } finally {
      setVerifying(false);
    }
  };

  const fetchChecklist = async () => {
    setChecklistLoading(true);
    try {
      const res = await api.get('/compliance/inspection-checklist');
      setChecklist(res.data);
    } catch (err) {
      console.error('Error fetching checklist:', err);
    } finally {
      setChecklistLoading(false);
    }
  };

  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Compliance & Safety</h1>
        <p className="text-gray-600 mt-1">Manage FMCSA compliance, HOS logs, and inspections.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('hos')}
          className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'hos' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          HOS Tracker
        </button>
        <button
          onClick={() => setActiveTab('authority')}
          className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'authority' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Authority Verification
        </button>
        <button
          onClick={() => setActiveTab('inspection')}
          className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'inspection' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Inspection Checklist
        </button>
      </div>

      {/* HOS Tracker Tab */}
      {activeTab === 'hos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">Current Status</h2>
              </div>
              
              {hosLoading ? (
                <div className="flex justify-center py-6"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : hosStatus ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Driving Hours</p>
                    <p className="text-2xl font-bold text-gray-900">{hosStatus.driving_hours_used.toFixed(1)} / 11.0</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">On-Duty Hours</p>
                    <p className="text-2xl font-bold text-gray-900">{hosStatus.on_duty_hours_used.toFixed(1)} / 14.0</p>
                  </div>
                  <div className="p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: hosStatus.status === 'compliant' ? '#f0fdf4' : '#fef2f2' }}>
                    <div className={`p-2 rounded-lg ${hosStatus.status === 'compliant' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {hosStatus.status === 'compliant' ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                      <p className={`text-lg font-bold uppercase ${hosStatus.status === 'compliant' ? 'text-green-700' : 'text-red-700'}`}>{hosStatus.status}</p>
                    </div>
                  </div>
                </div>
              ) : <p className="text-gray-500">No HOS status available.</p>}
            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-slate-50">
                <h2 className="text-xl font-bold text-gray-900">7-Day History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Driving</th>
                      <th className="px-6 py-4">On Duty</th>
                      <th className="px-6 py-4">Off Duty</th>
                      <th className="px-6 py-4">Sleeper</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {hosHistory.map((log, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{new Date(log.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatMinutes(log.driving_minutes)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatMinutes(log.on_duty_minutes)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatMinutes(log.off_duty_minutes)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatMinutes(log.sleeper_minutes)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            log.status === 'compliant' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {hosHistory.length === 0 && !hosLoading && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No HOS history found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Log Form Sidebar */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Log Minutes (Today)</h3>
              <form onSubmit={handleLogHOS} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driving Minutes</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="0"
                    value={logForm.driving}
                    onChange={(e) => setLogForm({...logForm, driving: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">On-Duty Minutes</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="0"
                    value={logForm.onDuty}
                    onChange={(e) => setLogForm({...logForm, onDuty: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Off-Duty Minutes</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="0"
                    value={logForm.offDuty}
                    onChange={(e) => setLogForm({...logForm, offDuty: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sleeper Minutes</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="0"
                    value={logForm.sleeper}
                    onChange={(e) => setLogForm({...logForm, sleeper: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-primary/20 mt-4"
                >
                  Submit Daily Log
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Authority Tab */}
      {activeTab === 'authority' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <UserCheck className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">Authority Verification</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">DOT Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. 1234567"
                  value={dotNumber}
                  onChange={(e) => setDotNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">MC Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. 987654"
                  value={mcNumber}
                  onChange={(e) => setMcNumber(e.target.value)}
                />
              </div>
            </div>
            
            <button
              onClick={handleVerifyAuthority}
              disabled={verifying || (!dotNumber && !mcNumber)}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {verifying ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify Authority Status'}
            </button>

            {verificationResult && (
              <div className="mt-12 p-8 border border-gray-100 rounded-2xl bg-slate-50 animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Verification Results</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      verificationResult.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {verificationResult.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Company Name</span>
                    <span className="text-gray-900 font-bold">{verificationResult.company_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Verification Date</span>
                    <span className="text-gray-900 font-bold">{new Date(verificationResult.verification_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inspection Tab */}
      {activeTab === 'inspection' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">DVIR Inspection Checklist</h2>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">FMCSA-Standard</p>
            </div>
            
            <div className="p-8">
              {checklistLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
              ) : (
                <div className="space-y-10">
                  {checklist.map((category) => (
                    <div key={category.category}>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-primary pl-4">{category.category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {category.items.map((item) => (
                          <label key={item} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:bg-slate-50 cursor-pointer transition-all group">
                            <div className="relative flex items-center">
                              <input 
                                type="checkbox" 
                                className="peer h-6 w-6 rounded-lg border-2 border-gray-200 text-primary focus:ring-primary appearance-none transition-all checked:bg-primary checked:border-primary" 
                              />
                              <Check className="absolute h-4 w-4 text-white left-1 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-8 border-t border-gray-100 flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
                      By submitting this report, you certify that the vehicle has been inspected in accordance with federal regulations.
                    </p>
                    <button className="bg-primary text-white px-12 py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-xl shadow-primary/20">
                      Submit Inspection Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compliance;
