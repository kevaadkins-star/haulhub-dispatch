import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, BarChart3, ArrowRight, Truck } from 'lucide-react';
import Navbar from '../components/Navbar';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-primary text-white py-24 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <Truck className="w-full h-full" />
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="md:w-1/2">
            <h2 className="text-5xl font-extrabold mb-6 leading-tight">
              One-Stop Dispatch <br />
              <span className="text-accent">Built for Truckers.</span>
            </h2>
            <p className="text-xl mb-10 text-blue-100">
              Find high-paying loads, stay FMCSA-compliant, and manage your authority in one place. 
              The partner you need for the long haul.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="bg-accent hover:bg-amber-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all shadow-lg flex items-center gap-2">
                Get Started <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="bg-transparent border-2 border-white hover:bg-white hover:text-primary py-4 px-10 rounded-lg text-lg transition-all font-bold">
                See Pricing
              </button>
            </div>
          </div>
          <div className="md:w-1/2 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 hidden md:block">
            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-4 w-24 bg-slate-700 rounded"></div>
                  <div className="h-8 w-20 bg-accent/20 rounded"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-20 w-full bg-slate-800 rounded-lg border border-slate-700"></div>
                  <div className="h-20 w-full bg-slate-800 rounded-lg border border-slate-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to keep moving</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">Focus on the road while HaulHub handles the logistics and compliance.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-10 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <MapPin className="h-8 w-8" />
            </div>
            <h4 className="text-2xl font-bold mb-4">Smart Load Matching</h4>
            <p className="text-gray-600 leading-relaxed">
              Find loads that match your equipment and preferred lanes. Access premium load boards and get real-time alerts for the best rates.
            </p>
          </div>

          <div className="p-10 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group">
            <div className="p-4 bg-teal-100 text-teal-600 rounded-xl w-fit mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h4 className="text-2xl font-bold mb-4">FMCSA Compliance</h4>
            <p className="text-gray-600 leading-relaxed">
              Stay inspection-ready with automated HOS tracking, IFTA reporting, and documentation management. We keep you compliant so you stay on the road.
            </p>
          </div>

          <div className="p-10 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group">
            <div className="p-4 bg-amber-100 text-amber-600 rounded-xl w-fit mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h4 className="text-2xl font-bold mb-4">Authority Management</h4>
            <p className="text-gray-600 leading-relaxed">
              Bring your own authority or lease onto our vetted carrier network. We handle the paperwork and verification for your DOT/MC numbers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to maximize your earnings?</h2>
          <p className="text-slate-400 text-lg mb-10">Join thousands of owner-operators who trust HaulHub for their dispatch and compliance needs.</p>
          <Link to="/register" className="bg-accent hover:bg-amber-600 text-white font-bold py-4 px-12 rounded-lg text-lg transition-all inline-block">
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">HaulHub Dispatch</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
          </div>
          <p className="text-sm text-gray-400">© 2026 HaulHub Dispatch. Powered by Turso.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
