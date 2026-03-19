import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  Bot, 
  Sparkles, 
  ArrowRight, 
  BarChart3, 
  MessageSquare,
  Zap,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'bulk-send',
      title: 'Bulk SMS Engine',
      description: 'Send thousands of WhatsApp messages with 100% delivery rate and smart scheduling.',
      icon: <Send className="text-whatsapp-dark" size={32} />,
      btnText: 'Open Engine',
      path: '/bulk-send',
      color: 'from-whatsapp-light/10 to-transparent',
      borderColor: 'border-whatsapp-light/20',
      badge: 'Active Now'
    },
    {
      id: 'chatbot',
      title: 'AI Chatbot System',
      description: 'Deploy an intelligent AI agent to handle customer queries, book appointments, and generate leads 24/7.',
      icon: <Bot className="text-blue-500" size={32} />,
      btnText: 'Configure Chatbot',
      path: '/chatbot-config',
      color: 'from-blue-50 to-transparent',
      borderColor: 'border-blue-100',
      badge: 'New Feature'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 text-whatsapp-dark font-bold text-xs uppercase tracking-widest mb-1">
              <ShieldCheck size={14} /> WhatsApp Business API
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Main Dashboard</h1>
            <p className="text-gray-500 font-medium mt-1">Select a powerful tool to grow your business.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 px-4 border-r border-gray-100">
              <div className="w-3 h-3 rounded-full bg-whatsapp-light animate-pulse"></div>
              <span className="text-sm font-bold text-gray-700">+91 98765 43210</span>
            </div>
            <div className="px-4 text-xs font-black uppercase text-gray-400">
              sk_live_...f4a5
            </div>
          </motion.div>
        </header>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative overflow-hidden bg-white p-8 rounded-[40px] border-2 ${feature.borderColor} shadow-xl shadow-gray-200/50 group cursor-pointer`}
              onClick={() => navigate(feature.path)}
            >
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${feature.color} rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-125 duration-700`}></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-5 bg-white rounded-3xl shadow-lg border border-gray-50 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full text-gray-500 border border-gray-100">
                    {feature.badge}
                  </span>
                </div>

                <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
                  {feature.title}
                </h2>
                <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                  {feature.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                           <img src={`https://i.pravatar.cc/100?u=${feature.id}-${i}`} alt="user" />
                         </div>
                       ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400">Used by 2.4k+ users</span>
                  </div>

                  <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-black transition-all group-hover:gap-4">
                    {feature.btnText} <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Stats/Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { label: 'Total Messages', value: '45.2k', icon: <MessageSquare size={16} /> },
            { label: 'Bot Interactions', value: '1.8k', icon: <Bot size={16} /> },
            { label: 'Delivery Rate', value: '99.9%', icon: <Zap size={16} /> },
            { label: 'Active Regions', value: '12', icon: <Globe size={16} /> }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                {stat.icon}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{stat.label}</div>
                <div className="text-lg font-black text-gray-900 leading-tight">{stat.value}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
