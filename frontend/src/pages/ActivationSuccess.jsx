import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Copy, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Phone,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActivationSuccess = () => {
  const [showKey, setShowKey] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const apiKey = 'sk_watsap_live_4f8e21b0a9c1d2e3f4a5b6c7';
  const connectedNumber = '+91 98765 43210';
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate connectivity check
    const timer = setTimeout(() => {
      setVerifying(false);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#25D366', '#128C7E', '#075E54']
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-whatsapp-light/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-whatsapp-dark/10 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="glass rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-whatsapp-light to-whatsapp-dark"></div>
          
          <AnimatePresence mode="wait">
            {verifying ? (
              <motion.div 
                key="verifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center"
              >
                <div className="w-20 h-20 border-4 border-whatsapp-light/20 border-t-whatsapp-dark rounded-full animate-spin mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-800">Verifying API Connectivity...</h2>
                <p className="text-gray-500 mt-2">Connecting your number to the WhatsApp Business Platform</p>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div>
                  <div className="inline-flex p-4 bg-whatsapp-light/10 text-whatsapp-dark rounded-full mb-6">
                    <CheckCircle2 size={48} strokeWidth={2.5} />
                  </div>
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight">API Activated!</h1>
                  <p className="text-gray-500 text-lg mt-2">Your WhatsApp Bulk SMS engine is now live and ready.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {/* API Key Card */}
                  <div className="bg-white/50 border border-gray-100 p-6 rounded-3xl space-y-3 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <Key size={14} /> Your API Key
                    </div>
                    <div className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                        {showKey ? apiKey : '••••••••••••••••••••••••'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setShowKey(!showKey)} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors">
                          {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button onClick={() => copyToClipboard(apiKey)} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors">
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Connected Number Card */}
                  <div className="bg-white/50 border border-gray-100 p-6 rounded-3xl space-y-3 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <Phone size={14} /> Connected Number
                    </div>
                    <div className="flex items-center justify-between p-3 bg-whatsapp-light/5 rounded-xl border border-whatsapp-light/10 text-whatsapp-dark">
                      <span className="font-bold">{connectedNumber}</span>
                      <ShieldCheck size={18} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-whatsapp-dark hover:bg-whatsapp-darker text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-whatsapp-dark/20 group"
                  >
                    Go to Dashboard <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="flex items-center justify-center gap-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5"><Zap size={14} className="text-yellow-500" /> High Performance</div>
                    <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-blue-500" /> 100% Encrypted</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ActivationSuccess;
