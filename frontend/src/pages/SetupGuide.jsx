import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  Image as ImageIcon, 
  FileText, 
  ChevronRight, 
  ExternalLink,
  Sparkles,
  Target,
  Headphones,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SupportModal from '../components/SupportModal';

const SetupGuide = () => {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [assignedExpert, setAssignedExpert] = useState(null);
  const [steps, setSteps] = useState([
    { id: 1, title: 'Create Facebook Business Account', completed: false, description: 'Start by setting up your business presence on Meta.' },
    { id: 2, title: 'Verify Business', completed: false, description: 'Complete the verification process to unlock full API capabilities.' },
    { id: 3, title: 'Apply for WhatsApp API', completed: false, description: 'Request access to the WhatsApp Business Platform.' },
    { id: 4, title: 'Configure API Credentials', completed: false, description: 'Set up your access tokens and phone number IDs.' },
    { id: 5, title: 'Connect Number', completed: false, description: 'Finalize the connection to start sending messages.' },
  ]);

  const navigate = useNavigate();
  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  const toggleStep = (id) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, completed: !step.completed } : step
    ));
  };

  const handleSelectExpert = (type) => {
    setIsSupportOpen(false);
    setAssignedExpert({
      name: 'Rahul K.',
      role: 'WhatsApp Expert',
      status: 'Ready to help',
      avatar: 'https://ui-avatars.com/api/?name=Rahul+K&background=128C7E&color=fff'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Progress & Header */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-3xl p-8 shadow-xl border-t-4 border-whatsapp-dark relative"
          >
            <button 
              onClick={() => setIsSupportOpen(true)}
              className="absolute top-4 right-4 p-2 bg-whatsapp-light/10 text-whatsapp-dark rounded-full hover:bg-whatsapp-light/20 transition-all group"
              title="Get Expert Help"
            >
              <Headphones size={18} className="group-hover:rotate-12 transition-transform" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-whatsapp-light/10 rounded-xl text-whatsapp-dark">
                <Target size={24} strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                Guided Self-Service Flow
              </h1>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Your Progress</span>
                <span className="text-2xl font-black text-whatsapp-dark">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-whatsapp-light to-whatsapp-dark"
                />
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {completedCount} of {steps.length} steps completed
              </p>
            </div>

            {progress === 100 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => navigate('/activation-success')}
                className="w-full mt-8 bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg"
              >
                Finalize Activation <Sparkles size={18} className="text-yellow-400" />
              </motion.button>
            )}
          </motion.div>

          {assignedExpert && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-[24px] p-5 border border-whatsapp-light/20 bg-whatsapp-light/5"
            >
              <div className="flex items-center gap-4">
                <img src={assignedExpert.avatar} alt="Expert" className="w-12 h-12 rounded-full border-2 border-whatsapp-light/30" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 text-sm">{assignedExpert.name}</h4>
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase text-whatsapp-dark">
                      <div className="w-1.5 h-1.5 rounded-full bg-whatsapp-light animate-pulse"></div>
                      Online
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium">{assignedExpert.role}</p>
                </div>
              </div>
              <button className="w-full mt-4 bg-whatsapp-dark text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-whatsapp-darker transition-all">
                <MessageSquare size={14} /> Message Rahul
              </button>
            </motion.div>
          )}

          <div className="hidden lg:block p-6 bg-gradient-to-br from-whatsapp-dark to-whatsapp-darker rounded-3xl text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="font-bold mb-2">Need help?</h3>
            <p className="text-sm text-white/80 mb-4 leading-relaxed">Our support team is available 24/7 to assist with your API configuration.</p>
            <button className="text-xs font-bold uppercase tracking-widest bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2">
              Chat Now <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Steps Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group relative overflow-hidden glass rounded-[24px] p-6 border-2 transition-all duration-300 ${
                  step.completed 
                    ? 'border-whatsapp-light/30 bg-whatsapp-light/5' 
                    : 'border-transparent hover:border-gray-200'
                }`}
              >
                <div className="flex items-start gap-5">
                  <button 
                    onClick={() => toggleStep(step.id)}
                    className={`mt-1 flex-shrink-0 transition-all transform active:scale-90 ${
                      step.completed ? 'text-whatsapp-dark scale-110' : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 size={28} fill="currentColor" className="text-whatsapp-light" /> : <Circle size={28} strokeWidth={1.5} />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className={`text-lg font-bold transition-all ${step.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {step.title}
                      </h3>
                      {!step.completed && (
                        <span className="flex-shrink-0 text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-md uppercase tracking-tighter">
                          Required
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mb-6 ${step.completed ? 'text-gray-300' : 'text-gray-500'}`}>
                      {step.description}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider bg-white border border-gray-100 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                        <PlayCircle size={16} className="text-whatsapp-dark" /> Video tutorial
                      </button>
                      <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider bg-white border border-gray-100 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                        <ImageIcon size={16} className="text-blue-500" /> Screenshots
                      </button>
                      <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider bg-white border border-gray-100 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                        <FileText size={16} className="text-orange-500" /> Instructions
                      </button>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors border border-transparent hover:border-gray-200">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <SupportModal 
        isOpen={isSupportOpen} 
        onClose={() => setIsSupportOpen(false)} 
        onSelectExpert={handleSelectExpert}
      />
    </div>
  );
};

export default SetupGuide;
