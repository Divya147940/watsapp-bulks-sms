import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  PlayCircle, 
  Image as ImageIcon, 
  FileText, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

const StepContentModal = ({ isOpen, onClose, step, initialTab = 'video' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!step) return null;

  const tabs = [
    { id: 'video', label: 'Video Tutorial', icon: PlayCircle, color: 'text-whatsapp-dark' },
    { id: 'screenshots', label: 'Screenshots', icon: ImageIcon, color: 'text-blue-500' },
    { id: 'instructions', label: 'Instructions', icon: FileText, color: 'text-orange-500' },
  ];

  const content = {
    0: { // Personal Facebook Account
      video: "https://www.youtube.com/embed/Y8kihPdCI_U", // Professional Meta API guide
      screenshots: ["/images/setup_step0.png"],
      instructions: [
        "Go to facebook.com",
        "Click on 'Create New Account' if you don't have one",
        "Ensure your profile and name are accurate",
        "Complete any email/mobile verification requested by Facebook"
      ],
      link: "https://www.facebook.com"
    },
    1: { // Enable Two-Factor (2FA)
      video: "https://www.youtube.com/embed/Y8kihPdCI_U", 
      screenshots: ["/images/setup_step0.png"], 
      instructions: [
        "Go to Facebook Settings -> Password and Security",
        "Click on 'Two-factor authentication'",
        "Set up an Authentication App or SMS verification",
        "This is required before Meta allows business verification!"
      ],
      link: "https://accountscenter.facebook.com/password_and_security"
    },
    2: { // Create Business Account
      video: "https://www.youtube.com/embed/Y8kihPdCI_U", 
      screenshots: ["/images/setup_step1.png"],
      instructions: [
        "Go to business.facebook.com/overview",
        "Click 'Create Account'",
        "Enter your Business Name and Work Email",
        "Complete the setup and check your email for confirmation"
      ],
      link: "https://business.facebook.com/overview"
    },
    3: { // Add WhatsApp Account
      video: "https://www.youtube.com/embed/Y8kihPdCI_U",
      screenshots: ["/images/setup_step3.png"],
      instructions: [
        "In Business Settings, go to Accounts -> WhatsApp Accounts",
        "Click the 'Add' button",
        "Choose 'Create a new WhatsApp Business Account'",
        "Follow the steps to link your presence"
      ],
      link: "https://business.facebook.com/settings/whatsapp-business-accounts"
    },
    4: { // Verify Phone Number
      video: "https://www.youtube.com/embed/Y8kihPdCI_U",
      screenshots: ["/images/setup_step3.png"],
      instructions: [
        "In your WhatsApp Account settings, click 'Add Phone Number'",
        "Enter your phone number (it should not have an active personal WhatsApp account)",
        "Choose 'SMS' or 'Voice' for verification",
        "Enter the 6-digit OTP code sent to your phone"
      ],
      link: "https://business.facebook.com/settings/whatsapp-business-accounts"
    },
    5: { // Get 24-Hour Token
      video: "https://www.youtube.com/embed/Y8kihPdCI_U",
      screenshots: ["/images/setup_step4.png"],
      instructions: [
        "Go to WhatsApp -> API Setup in your App dashboard",
        "Copy the 'Temporary Access Token' (This expires in 24 hours!)",
        "Copy your 'Phone Number ID'",
        "Use these for immediate testing in the app"
      ],
      link: "https://developers.facebook.com/apps"
    },
    6: { // Add Payment Method
      video: "https://www.youtube.com/embed/Y8kihPdCI_U",
      screenshots: ["/images/setup_step5.png"],
      instructions: [
        "Go to 'Billing & Payments' in Meta Business Suite",
        "Click 'Payment Methods' and then 'Add'",
        "Enter your Debit/Credit card details",
        "This ensures your bulk campaigns are never interrupted"
      ],
      link: "https://business.facebook.com/billing_hub"
    },
    7: { // Start Verification
      video: "https://www.youtube.com/embed/8-qZ8uUoXvI",
      screenshots: ["/images/setup_step2.png"],
      instructions: [
        "Go to Business Settings -> Security Center",
        "Look for 'Business Verification' and click 'Start'",
        "Upload your Business Proof (GST/PAN/License)",
        "This unlocks higher messaging limits"
      ],
      link: "https://business.facebook.com/settings/security-center"
    },
    8: { // Create Templates
      video: "https://www.youtube.com/embed/Y8kihPdCI_U",
      screenshots: ["/images/setup_step4.png"], 
      instructions: [
        "In WhatsApp Manager, click 'Message Templates'",
        "Click 'Create Template' and choose a category (e.g., Marketing)",
        "Fill in your message and click 'Submit'",
        "Wait for Meta's approval (usually takes 5-10 minutes)"
      ],
      link: "https://business.facebook.com/wa/manage/templates"
    },
    9: { // Generate Permanent Token
      video: "https://www.youtube.com/embed/Y8kihPdCI_U",
      screenshots: ["/images/setup_step4.png"],
      instructions: [
        "In Business Settings, go to Users -> System Users",
        "Create a System User and grant it Full Control",
        "Assign the WhatsApp Account as an asset",
        "Click 'Generate New Token' and select 'whatsapp_business_messaging'",
        "This token will NEVER EXPIRE!"
      ],
      link: "https://business.facebook.com/settings/system-users"
    },
    10: { // Finalize Connection
      video: "https://www.youtube.com/embed/Y8kihPdCI_U",
      screenshots: ["/images/setup_step4.png"],
      instructions: [
        "Enter all your IDs and your Permanent Token in the app",
        "Test the connection by sending a simple message",
        "Congratulations! You are now live with Bulk WhatsApp SMS"
      ],
      link: "/credentials"
    }
  }[step.id];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-[32px] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#F8FAFC]">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{step.title}</h2>
                <p className="text-sm text-gray-500 font-medium">{step.description}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#F8FAFC] border-b border-gray-100 p-2 gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200/50'
                  }`}
                >
                  <tab.icon size={18} className={tab.color} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              {activeTab === 'instructions' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {content.instructions.map((inst, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-whatsapp-light/10 text-whatsapp-dark flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1 p-4 bg-gray-50 rounded-2xl border border-transparent group-hover:border-whatsapp-light/30 group-hover:bg-white transition-all shadow-sm">
                        <p className="text-gray-900 font-semibold leading-relaxed">
                          {inst}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="p-6 bg-whatsapp-light/5 rounded-[24px] border border-whatsapp-light/20 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-whatsapp-light/10 flex items-center justify-center animate-bounce">
                      <CheckCircle2 size={24} className="text-whatsapp-dark" />
                    </div>
                    <p className="text-sm font-bold text-whatsapp-dark">
                      Follow these steps and you'll be done in minutes!
                    </p>
                  </div>
                  <a 
                    href={step.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 py-4 bg-gray-900 text-white rounded-[24px] font-bold hover:bg-black transition-all shadow-xl group"
                  >
                    Open Meta Settings <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              )}

              {activeTab === 'screenshots' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {content.screenshots.map((src, i) => (
                    <div key={i} className="rounded-3xl overflow-hidden border-2 border-gray-100 shadow-md">
                      <img 
                        src={src} 
                        alt={`Step ${step.id} Screenshot ${i+1}`} 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'video' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="aspect-video w-full rounded-3xl overflow-hidden border-4 border-gray-100 shadow-xl bg-gray-900 flex items-center justify-center relative group"
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src={content.video}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="opacity-80 group-hover:opacity-100 transition-opacity"
                  ></iframe>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50/50">
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-whatsapp-dark text-white rounded-2xl font-bold hover:bg-whatsapp-darker transition-all shadow-lg"
              >
                Got it, let's go!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StepContentModal;
