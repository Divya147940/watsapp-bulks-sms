import React, { useState, useEffect } from 'react';
import { Send, Upload, Hash, AlertCircle, CheckCircle2, LayoutTemplate, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/client';

const BulkSend = () => {
  const [message, setMessage] = useState('');
  const [manualNumbers, setManualNumbers] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  // States for Template & Payment
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [recipientsCount, setRecipientsCount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customTemplateStatus, setCustomTemplateStatus] = useState('none');
  const COST_PER_MESSAGE = 0.50; // ₹0.50 per record

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await apiClient.get('/templates');
      if (res.data && Array.isArray(res.data)) {
        setTemplates(res.data);
      } else if (res.data && res.data.templates && Array.isArray(res.data.templates)) {
        setTemplates(res.data.templates);
      } else {
        setTemplates([]);
      }
    } catch (err) {
      console.error('Failed to fetch templates:', err);
      setTemplates([]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      // Mock counting for now - in real app, parse Excel/CSV row count
      setRecipientsCount(147); // Sample count
    }
  };

  const handleManualNumbersChange = (e) => {
    const val = e.target.value;
    setManualNumbers(val);
    const count = val.split(/[,\n]/).filter(n => n.trim().length > 0).length;
    setRecipientsCount(count + (file ? 147 : 0));
  };

  const clearSelection = () => {
    setFile(null);
    setManualNumbers('');
    setResult(null);
    setError('');
    setSelectedTemplate(null);
    setMessage('');
    setRecipientsCount(0);
    setShowPaymentModal(false);
    setCustomTemplateStatus('none');
  };

  const handleInitiateSend = (e) => {
    e.preventDefault();
    if (!selectedTemplate && !message.trim()) {
      setError('Please select a template or enter a message.');
      return;
    }
    if (!file && !manualNumbers.trim()) {
      setError('Please provide recipients.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleFinalSend = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setShowPaymentModal(false);

    try {
      const formData = new FormData();
      formData.append('message', selectedTemplate ? selectedTemplate.body : message);
      if (selectedTemplate) formData.append('template_id', selectedTemplate.id);
      if (file) formData.append('file', file);
      if (manualNumbers) formData.append('manual_numbers', manualNumbers);

      const res = await apiClient.post('/messages/quick-send', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResult(res.data);
      setMessage('');
      setManualNumbers('');
      setFile(null);
      setSelectedTemplate(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send bulk messages.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-whatsapp-light rounded-lg text-white">
          <Send size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Unified Bulk Send</h2>
          <p className="text-sm text-gray-500">Send custom messages to one or many recipients instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Add Recipients */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
            <span className="text-whatsapp-dark text-lg font-bold">#</span> 1. Add Recipients
          </h3>
          
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">FILE UPLOAD (EXCEL/CSV/JSON)</label>
            <div className={`relative border-2 border-dashed rounded-xl p-6 transition-colors text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px] ${file ? 'border-whatsapp-light bg-whatsapp-bg/5' : 'border-gray-300 hover:border-whatsapp-light bg-gray-50'}`}>
              <input 
                type="file" 
                accept=".csv,.xlsx,.xls,.json"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 size={32} className="text-whatsapp-dark" />
                  <span className="text-sm font-medium text-gray-700">{file.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); setFile(null); setRecipientsCount(prev => prev - 147); }} className="text-xs text-red-500 hover:underline relative z-10">Remove file</button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Upload size={28} className="text-gray-500 mb-1" />
                  <span className="text-sm text-gray-600 font-medium tracking-wide">Click or drag to upload file</span>
                  <span className="text-[11px] text-gray-400">Supports .csv, .xlsx, .json</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <span className="text-xs font-bold text-gray-400 uppercase">OR</span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">MANUAL NUMBERS</label>
            <textarea 
              value={manualNumbers}
              onChange={handleManualNumbersChange}
              className="w-full h-[120px] px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-whatsapp-light transition-all resize-none bg-gray-50 text-gray-600 placeholder:text-gray-400"
              placeholder="Enter numbers separated&#10;by commas or new&#10;lines...&#10;e.g., 919876543210,&#10;911234567890"
            />
          </div>

          {/* Instant Cost Estimator */}
          {recipientsCount > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 rounded-xl bg-gradient-to-br from-whatsapp-bg/10 to-transparent border border-whatsapp-light/30 flex justify-between items-center shadow-sm"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">List Uploaded</p>
                <p className="text-xl font-black text-gray-800">{recipientsCount} <span className="text-sm font-medium text-gray-500">Recipients</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">Total Payable</p>
                <p className="text-xl font-black text-whatsapp-dark">₹{(recipientsCount * COST_PER_MESSAGE).toFixed(2)}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Compose Message */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-lg mb-6">
            <Send size={18} className="text-whatsapp-dark" /> 2. Compose Message
          </h3>
          
          <div className="flex-1 flex flex-col space-y-4">
            {/* Added Template Dropdown Integration */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Select Campaign Template (Optional)</label>
              <div className="relative">
                <LayoutTemplate className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-whatsapp-light bg-gray-50 font-medium text-gray-600 cursor-pointer appearance-none"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) {
                      setSelectedTemplate(null);
                      setMessage('');
                      setCustomTemplateStatus('none');
                      return;
                    }
                    const t = templates.find(temp => temp.id == val);
                    setSelectedTemplate(t || null);
                    if (t) setMessage(t.body);
                    setCustomTemplateStatus('none');
                  }}
                  value={selectedTemplate?.id || ""}
                >
                  <option value="">-- No Template (Custom Message) --</option>
                  {templates && templates.length > 0 && templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              
              {selectedTemplate && selectedTemplate.body.match(/{{(\d+)}}/g) && (
                <div className="flex gap-1 mt-2 text-[10px] text-gray-500">
                  <span className="font-bold text-whatsapp-dark">Required:</span> 
                  Variables found in template. Will be mapped from columns.
                </div>
              )}
            </div>

            <textarea 
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (customTemplateStatus === 'approved') setCustomTemplateStatus('none');
              }}
              disabled={!!selectedTemplate}
              className={`w-full flex-1 min-h-[160px] px-4 py-4 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-whatsapp-light transition-all resize-none shadow-sm ${selectedTemplate ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50'}`}
              placeholder="Type your WhatsApp&#10;message here..."
            />
            
            <div className="flex justify-between items-center text-xs text-gray-500 font-medium px-1">
              <span>Characters: {message.length} <span className="ml-1 opacity-70">Supports plain text only</span></span>
            </div>

            {/* Template Approval Simulator */}
            {!selectedTemplate && message.trim().length > 0 && customTemplateStatus !== 'approved' && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-xl flex flex-col gap-3 shadow-sm"
              >
                <div className="flex items-center gap-2 text-blue-800 text-xs font-bold uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  Custom Message Requires Approval
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setCustomTemplateStatus('verifying');
                    setTimeout(() => setCustomTemplateStatus('approved'), 1500);
                  }}
                  disabled={customTemplateStatus === 'verifying'}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {customTemplateStatus === 'verifying' ? (
                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> Scanning Content...</>
                  ) : (
                    'Submit for Quick Approval'
                  )}
                </button>
              </motion.div>
            )}

            {!selectedTemplate && customTemplateStatus === 'approved' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-2 text-green-700 text-sm font-bold">
                  <CheckCircle2 size={18} /> Template Approved!
                </div>
                <span className="text-[10px] font-bold uppercase text-green-600 tracking-wider bg-white px-2 py-0.5 rounded border border-green-100">Ready to Send</span>
              </motion.div>
            )}

            <div className="mt-auto pt-4">
              <button 
                onClick={handleInitiateSend}
                disabled={loading || recipientsCount === 0 || (!selectedTemplate && (!message.trim() || customTemplateStatus !== 'approved'))}
                className="w-full bg-[#51a88b] hover:bg-[#43967b] text-white py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-base shadow-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <><Send size={18} /> Send Message Now</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="bg-[#51a88b] p-6 text-white text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CreditCard size={24} />
                </div>
                <h3 className="text-xl font-bold">Confirm & Pay</h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Recipients</span>
                    <span className="font-bold">{recipientsCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Rate per Message</span>
                    <span className="font-bold">₹{COST_PER_MESSAGE.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg">
                    <span className="font-bold text-gray-800">Total Payable</span>
                    <span className="font-black text-[#51a88b]">₹{(recipientsCount * COST_PER_MESSAGE).toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-white p-3 border border-gray-200 rounded-lg flex items-center justify-center gap-2 py-4 shadow-sm cursor-pointer hover:bg-gray-50 transition">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-5" />
                  <span className="text-sm font-bold text-gray-600 ml-2">Pay via UPI (Simulator)</span>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={handleFinalSend}
                    className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-lg font-bold shadow-sm transition-all"
                  >
                    Confirm Payment & Send
                  </button>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success/Error Feedback */}
      {result && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3 text-green-800 mt-6 shadow-sm">
          <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold">Campaign Launched Successfully!</h4>
            <p className="text-sm mt-1">
              Your message is entering the queue for {result.success_count || recipientsCount} recipients.
            </p>
          </div>
          <button onClick={clearSelection} className="text-xs font-bold text-green-700 uppercase hover:underline">Clear</button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 mt-6 shadow-sm">
          <AlertCircle size={20} className="text-red-600" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}
    </div>
  );
};

export default BulkSend;
