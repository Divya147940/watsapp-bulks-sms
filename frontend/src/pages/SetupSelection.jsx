import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Rocket, 
  Sparkles,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { motion } from 'framer-motion';

const SetupSelection = () => {
  const navigate = useNavigate();

  const options = [
    {
      id: 'self-service',
      title: 'Self-Service Setup',
      subtitle: 'I want to do it myself',
      description: 'Follow our 5-step guided checklist. Best for experienced users or those with existing Meta accounts.',
      icon: <Settings className="text-whatsapp-dark" size={32} />,
      btnText: 'Start Setup Guide',
      path: '/setup-guide',
      color: 'bg-whatsapp-light/5',
      borderColor: 'border-whatsapp-light/20',
      features: ['5-Step Checklist', 'Video Tutorials', 'Instant Activation']
    },
    {
      id: 'assisted-setup',
      title: 'Expert Assisted',
      subtitle: 'Setup for me (Recommended)',
      description: 'Our team will handle the Meta verification, API configuration, and phone number porting for you.',
      icon: <Headphones className="text-blue-500" size={32} />,
      btnText: 'Request Expert Help',
      path: '/assisted-setup-form',
      color: 'bg-blue-50',
      borderColor: 'border-blue-100',
      features: ['Concierge Service', 'Meta Verification Help', '24h Turnaround'],
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-whatsapp-light/10 text-whatsapp-dark rounded-full text-xs font-black uppercase tracking-widest mb-6"
          >
            <ShieldCheck size={14} /> Step 2: Choose Your Path
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            How would you like to set up?
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
            Choose the method that works best for you. Either path leads to a fully verified WhatsApp Business API.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative overflow-hidden bg-white p-10 rounded-[48px] border-2 ${option.borderColor} shadow-2xl shadow-gray-200/50 group cursor-pointer`}
              onClick={() => navigate(option.path)}
            >
              {option.popular && (
                <div className="absolute top-8 right-[-35px] bg-blue-500 text-white px-12 py-1 rotate-45 text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Recommended
                </div>
              )}

              <div className="relative z-10">
                <div className={`w-20 h-20 ${option.color} rounded-[32px] flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                  {option.icon}
                </div>

                <div className="mb-8">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{option.subtitle}</div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{option.title}</h2>
                </div>

                <p className="text-gray-500 font-medium mb-10 leading-relaxed text-sm">
                  {option.description}
                </p>

                <div className="space-y-4 mb-10">
                  {option.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                        <CheckCircle2 size={12} strokeWidth={3} />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <button 
                  className={`w-full py-5 rounded-3xl font-black text-sm flex items-center justify-center gap-2 transition-all group-hover:gap-4 ${
                    option.id === 'assisted-setup' 
                    ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-xl shadow-blue-500/20' 
                    : 'bg-gray-900 text-white hover:bg-black shadow-xl shadow-gray-900/20'
                  }`}
                >
                  {option.btnText} <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 font-bold text-sm flex items-center justify-center gap-2">
            <Rocket size={16} /> Both options include lifetime updates and 24/7 technical support.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SetupSelection;
