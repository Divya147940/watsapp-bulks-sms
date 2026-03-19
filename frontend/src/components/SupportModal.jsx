import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, PhoneCall, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';

const SupportModal = ({ isOpen, onClose, onSelectExpert }) => {
  if (!isOpen) return null;

  const options = [
    {
      id: 'whatsapp',
      title: 'Chat on WhatsApp',
      description: 'Connect with our support team instantly.',
      icon: <MessageSquare className="text-whatsapp-dark" size={24} />,
      badge: 'Fastest Response',
      color: 'bg-whatsapp-light/10'
    },
    {
      id: 'call',
      title: 'Schedule a Call',
      description: 'Talk to an expert for technical guidance.',
      icon: <PhoneCall className="text-blue-500" size={24} />,
      badge: 'Best for Setup',
      color: 'bg-blue-50'
    },
    {
      id: 'concierge',
      title: 'Personal Concierge',
      description: 'We handle the entire setup for you.',
      icon: <UserCheck className="text-purple-500" size={24} />,
      badge: 'Premium Only',
      color: 'bg-purple-50'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl relative"
        >
          {/* Header */}
          <div className="p-8 pb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-whatsapp-dark font-bold text-xs uppercase tracking-widest mb-1">
                <Sparkles size={14} /> Assisted Setup
              </div>
              <h2 className="text-2xl font-black text-gray-900">How can we help you?</h2>
              <p className="text-gray-500 text-sm mt-1">Our expert team is ready to assist you step-by-step.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="px-8 pb-8 space-y-4">
            {options.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectExpert(option.id)}
                className={`w-full text-left p-5 rounded-2xl border-2 border-transparent hover:border-whatsapp-light/30 transition-all flex items-start gap-4 ${option.color}`}
              >
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-gray-900">{option.title}</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter bg-white/50 px-2 py-0.5 rounded-md text-gray-600">
                      {option.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </motion.button>
            ))}

            <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-400 font-medium justify-center">
              <ShieldCheck size={14} className="text-whatsapp-light" />
              Verified Expert Support • 24/7 Availability
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SupportModal;
