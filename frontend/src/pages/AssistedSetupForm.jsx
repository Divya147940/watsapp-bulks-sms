import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Briefcase, 
  Globe, 
  Phone, 
  Mail, 
  Building2, 
  Send, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AssistedSetupForm = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    email: '',
    useCase: 'Marketing'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate team sync after 3 seconds
    setTimeout(() => {
       navigate('/setup-guide');
    }, 3500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-blue-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <CheckCircle2 size={48} className="text-blue-500" strokeWidth={3} />
            </motion.div>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Lead Submitted!</h1>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Our expert team has received your biodata. We are now preparing your environment. Redirecting you to the progress tracker...
          </p>
          <div className="flex justify-center gap-2">
            {[1,2,3].map(i => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                className="w-2 h-2 bg-blue-500 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/setup-selection')}
          className="flex items-center gap-2 text-gray-400 font-bold text-sm hover:text-gray-900 transition-colors mb-12 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Choice
        </button>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/20">
               <Sparkles size={24} />
             </div>
             <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Business Biodata</h1>
                <p className="text-gray-500 font-medium lowercase tracking-wide first-letter:uppercase">Tell us about your business for expert setup.</p>
             </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[40px] border-2 border-gray-50 shadow-2xl shadow-gray-200/50 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Business Registered Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Acme Innovations"
                  className="w-full bg-gray-50 border-0 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-300"
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Business Website</label>
               <div className="relative">
                 <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                 <input 
                   required
                   type="url" 
                   placeholder="https://example.com"
                   className="w-full bg-gray-50 border-0 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-300"
                   onChange={(e) => setFormData({...formData, website: e.target.value})}
                 />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Official Email Address</label>
               <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                 <input 
                   required
                   type="email" 
                   placeholder="support@acme.com"
                   className="w-full bg-gray-50 border-0 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-300"
                   onChange={(e) => setFormData({...formData, email: e.target.value})}
                 />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Primary Use Case</label>
               <div className="relative">
                 <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                 <select 
                   className="w-full bg-gray-50 border-0 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                   onChange={(e) => setFormData({...formData, useCase: e.target.value})}
                 >
                   <option>Marketing & Sales</option>
                   <option>Customer Support</option>
                   <option>OTP & Alerts</option>
                   <option>Chatbot Automation</option>
                 </select>
               </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50">
             <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-50 mb-8 flex items-start gap-4">
                <div className="p-2 bg-blue-500 text-white rounded-lg">
                  <ShieldCheck size={18} />
                </div>
                <p className="text-xs text-blue-800 font-bold leading-relaxed">
                  By submitting this form, you authorize our experts to begin the WhatsApp Business API verification process. We will never share your business details with third parties.
                </p>
             </div>

             <button 
               type="submit"
               className="w-full bg-gray-900 text-white py-5 rounded-[28px] font-black text-lg flex items-center justify-center gap-3 hover:bg-black transition-all shadow-2xl shadow-gray-900/10 group active:scale-[0.98]"
             >
               Submit Metadata & Connect Team <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssistedSetupForm;
