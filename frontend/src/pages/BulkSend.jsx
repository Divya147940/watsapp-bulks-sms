import React, { useState } from 'react';
import { Send, Upload, Trash2, Hash, AlertCircle, CheckCircle2 } from 'lucide-react';
import apiClient from '../api/client';

const BulkSend = () => {
  const [message, setMessage] = useState('');
  const [manualNumbers, setManualNumbers] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const clearSelection = () => {
    setFile(null);
    setManualNumbers('');
    setResult(null);
    setError('');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please enter a message to send.');
      return;
    }
    if (!file && !manualNumbers.trim()) {
      setError('Please provide recipients via file upload or manual entry.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('message', message);
      if (file) formData.append('file', file);
      if (manualNumbers) formData.append('manual_numbers', manualNumbers);

      const res = await apiClient.post('/messages/quick-send', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResult(res.data);
      setMessage('');
      setManualNumbers('');
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send bulk messages. Please check your inputs and server status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-whatsapp-light rounded-lg text-white">
          <Send size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Unified Bulk Send</h2>
          <p className="text-sm text-gray-500">Send custom messages to one or many recipients instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Recipients */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Hash size={18} className="text-whatsapp-dark" />
              1. Add Recipients
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">File Upload (Excel/CSV/JSON)</label>
                <div className={`relative border-2 border-dashed rounded-xl p-6 transition-colors text-center ${file ? 'border-whatsapp-light bg-whatsapp-bg/10' : 'border-gray-200 hover:border-whatsapp-light bg-gray-50'}`}>
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
                      <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-xs text-red-500 hover:underline">Remove file</button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={32} className="text-gray-400" />
                      <span className="text-sm text-gray-500">Click or drag to upload file</span>
                      <span className="text-[10px] text-gray-400">Supports .csv, .xlsx, .json</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative py-2 text-center text-xs text-gray-400 font-bold uppercase">
                <span className="bg-white px-2 relative z-10">or</span>
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -z-0"></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Manual Numbers</label>
                <textarea 
                  value={manualNumbers}
                  onChange={(e) => setManualNumbers(e.target.value)}
                  className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-whatsapp-light transition-all resize-none bg-gray-50"
                  placeholder="Enter numbers separated by commas or new lines...&#10;e.g., 919876543210, 911234567890"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Message */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col space-y-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Send size={18} className="text-whatsapp-dark" />
              2. Compose Message
            </h3>
            
            <div className="flex-1 flex flex-col">
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full flex-1 min-h-[250px] px-4 py-4 border border-gray-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-whatsapp-light transition-all resize-none bg-gray-50 shadow-inner"
                placeholder="Type your WhatsApp message here..."
              />
              <div className="flex justify-between items-center mt-3 px-1 text-xs text-gray-400 font-medium">
                <span>Characters: {message.length}</span>
                <span>Supports plain text only</span>
              </div>
            </div>

            <button 
              onClick={handleSend}
              disabled={loading || (!file && !manualNumbers.trim()) || !message.trim()}
              className="w-full bg-whatsapp-dark hover:bg-whatsapp-darker text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 shadow-xl shadow-whatsapp-light/30"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><Send size={20} /> Send Message Now</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Feedback */}
      {result && (
        <div className="glass p-6 rounded-2xl bg-green-50 border border-green-200 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-2 bg-green-100 rounded-full text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-green-800">Campaign Launched!</h4>
            <p className="text-sm text-green-700 mt-1">
              Your message is being sent to <strong>{result.success_count}</strong> recipients. 
              Track status in the <strong>Campaigns</strong> tab.
            </p>
            <button 
                onClick={clearSelection}
                className="mt-3 text-xs font-bold text-green-600 hover:text-green-800 uppercase tracking-widest bg-white px-3 py-1 rounded border border-green-200"
            >
                Reset Form
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="glass p-6 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 text-red-800">
          <AlertCircle size={24} className="flex-shrink-0 text-red-500" />
          <div className="text-sm break-words">{error}</div>
        </div>
      )}

      {/* Quick Preview Section */}
      <div className="mt-8 bg-gray-100 rounded-2xl p-6 border border-gray-200">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-whatsapp-light animate-pulse"></span>
              WhatsApp Preview
          </h4>
          <div className="max-w-[300px] mx-auto bg-[#e5ddd5] p-3 rounded-lg shadow-inner border border-gray-300 relative h-40 overflow-hidden opacity-80 select-none">
              <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-[11px] relative">
                  <div className="absolute -left-2 top-0 border-8 border-transparent border-r-white border-t-white"></div>
                  {message || "Your message will look like this..."}
                  <div className="text-[9px] text-gray-400 text-right mt-1">12:34 PM</div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default BulkSend;
