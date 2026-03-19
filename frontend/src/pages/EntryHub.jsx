import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const EntryHub = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mobileNumber.length < 10) return;
    
    setLoading(true);
    // Simulate a brief delay for premium feel
    setTimeout(() => {
      setLoading(false);
      // Navigate to Setup Selection choice page
      navigate('/setup-selection');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-whatsapp-light/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-whatsapp-dark/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[450px] z-10"
      >
        <div className="glass rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-whatsapp-light via-whatsapp-dark to-whatsapp-darker"></div>

          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex p-4 bg-whatsapp-light/10 rounded-2xl text-whatsapp-dark mb-6"
            >
              <Phone size={32} strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              2. User Onboarding Flow
            </h1>
            <div className="flex items-center justify-center gap-2 text-whatsapp-dark font-bold text-sm uppercase tracking-widest mb-4">
              <span className="w-8 h-[2px] bg-whatsapp-dark/30"></span>
              Step 1: Entry Point
              <span className="w-8 h-[2px] bg-whatsapp-dark/30"></span>
            </div>
            <p className="text-gray-500 text-lg leading-relaxed">
              Enter your mobile number to begin your journey with WhatsApp Bulk SMS.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                Mobile Number
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-whatsapp-dark transition-colors">
                  <Globe size={20} />
                </div>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl text-lg font-medium outline-none focus:ring-4 focus:ring-whatsapp-light/20 focus:border-whatsapp-light transition-all shadow-sm"
                  placeholder="e.g. 919876543210"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1.5 ml-1">
                <ShieldCheck size={14} className="text-whatsapp-light" />
                Your data is encrypted and secure
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || mobileNumber.length < 10}
              className="w-full bg-whatsapp-dark hover:bg-whatsapp-darker text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 shadow-lg shadow-whatsapp-dark/20"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Continue <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Feature highlights */}
          <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                <Zap size={18} />
              </div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Instant Setup</div>
            </div>
            <div className="flex items-center gap-3 text-right justify-end">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter text-right">Global Reach</div>
              <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                <Globe size={18} />
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-400 text-sm">
          Already have an account? <span className="text-whatsapp-dark font-bold hover:underline cursor-pointer">Sign In</span>
        </p>
      </motion.div>
    </div>
  );
};

export default EntryHub;
