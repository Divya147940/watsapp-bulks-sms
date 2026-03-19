import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  ArrowLeft, 
  Save, 
  Settings2, 
  MessageSquare, 
  Zap, 
  Sparkles,
  Info,
  Type,
  Mic,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotConfig = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('behavior');
  const [config, setConfig] = useState({
    businessName: '',
    businessDescription: '',
    agentName: 'WhatsApp Assistant',
    tone: 'Professional',
    temperature: 0.7,
    welcomeMessage: 'Hi! How can I help you today?'
  });

  const tabs = [
    { id: 'business', title: 'Business Info', icon: <Info size={18} /> },
    { id: 'behavior', title: 'Behavior', icon: <Zap size={18} /> },
    { id: 'appearance', title: 'Appearance', icon: <Type size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Navigation */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Configuration */}
          <div className="lg:col-span-2 space-y-8">
            <header>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/20">
                  <Bot size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">AI Chatbot System</h1>
                  <p className="text-gray-500 font-medium">Configure your intelligent AI agent behaviour.</p>
                </div>
              </div>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeTab === tab.id 
                    ? 'bg-white text-gray-900 shadow-sm shadow-gray-200' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon} {tab.title}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50"
            >
              {activeTab === 'behavior' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Agent Name</label>
                    <input 
                      type="text" 
                      value={config.agentName}
                      onChange={(e) => setConfig({...config, agentName: e.target.value})}
                      className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Chatbot Tone</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Professional', 'Friendly', 'Creative'].map(tone => (
                        <button
                          key={tone}
                          onClick={() => setConfig({...config, tone})}
                          className={`p-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                            config.tone === tone 
                            ? 'bg-blue-50 border-blue-500 text-blue-600' 
                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                          }`}
                        >
                          {tone}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end mb-1 px-1">
                      <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Creativity (Temp)</label>
                      <span className="text-xs font-bold text-blue-500">{config.temperature}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1"
                      value={config.temperature}
                      onChange={(e) => setConfig({...config, temperature: parseFloat(e.target.value)})}
                      className="w-full accent-blue-500 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'business' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Business Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Acme Corp"
                      className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">About your business</label>
                    <textarea 
                      rows={4}
                      placeholder="Describe what your business does, products, services..."
                      className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              <div className="mt-10 pt-8 border-t border-gray-50 flex justify-end">
                <button className="flex items-center gap-2 bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
                  <Save size={18} /> Save Configuration
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Preview */}
          <div className="space-y-8">
            <div className="bg-[#0B141A] rounded-[40px] p-2 aspect-[9/16] shadow-2xl relative overflow-hidden border-[8px] border-gray-900">
               {/* Mock Phone Status Bar */}
               <div className="h-6 flex justify-between items-center px-6 text-[10px] text-white">
                 <span>9:41</span>
                 <div className="flex gap-1">
                   {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-white/50 rounded-full"></div>)}
                 </div>
               </div>

               {/* Mock Header */}
               <div className="bg-[#202C33] p-4 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                   <Bot size={20} />
                 </div>
                 <div>
                   <div className="text-sm font-bold text-white leading-tight">{config.agentName}</div>
                   <div className="text-[10px] text-whatsapp-light font-bold">online</div>
                 </div>
               </div>

               {/* Mock Chat Area */}
               <div className="p-4 space-y-4 h-[calc(100%-120px)] overflow-y-auto">
                 <div className="bg-[#202C33] text-white p-3 rounded-2xl rounded-tl-none text-xs max-w-[85%] shadow-sm">
                   {config.welcomeMessage}
                 </div>
                 
                 <div className="flex justify-end">
                   <div className="bg-[#005C4B] text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-[85%] shadow-sm">
                     Hello! I need help with pricing.
                   </div>
                 </div>

                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="bg-[#202C33] text-white p-3 rounded-2xl rounded-tl-none text-xs max-w-[85%] shadow-sm flex items-center gap-2"
                 >
                   <div className="flex gap-0.5">
                     <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                     <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-75"></div>
                     <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-150"></div>
                   </div>
                   AI is typing...
                 </motion.div>
               </div>

               {/* Mock Input Area */}
               <div className="absolute bottom-0 left-0 w-full p-4 bg-[#202C33]/50 backdrop-blur-md">
                 <div className="bg-[#2A3942] rounded-full p-3 flex items-center justify-between">
                   <span className="text-xs text-gray-500 ml-2">Type a message</span>
                   <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                     <Zap size={14} />
                   </div>
                 </div>
               </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 relative overflow-hidden group">
               <div className="relative z-10">
                 <h4 className="font-black text-blue-900 mb-1 flex items-center gap-2">
                   <Sparkles size={16} /> Beta Access
                 </h4>
                 <p className="text-xs text-blue-700 font-medium">Your account has been granted early access to GPT-4o powered responses.</p>
               </div>
               <Bot size={80} className="absolute right-[-20px] bottom-[-20px] text-blue-500/10 group-hover:rotate-12 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotConfig;
