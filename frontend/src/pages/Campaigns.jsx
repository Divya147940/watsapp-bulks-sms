import React, { useState, useEffect } from 'react';
import { Send, Clock, CheckCircle2, XCircle, AlertCircle, Eye } from 'lucide-react';
import apiClient from '../api/client';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [contacts, setContacts] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]); // List of Contact IDs
  const [campaignDetails, setCampaignDetails] = useState(null); // ID of details being viewed

  const fetchData = async () => {
    try {
      setLoading(true);
      const [campRes, tempRes, contRes] = await Promise.all([
        apiClient.get('/messages/campaigns'),
        apiClient.get('/templates'),
        apiClient.get('/contacts')
      ]);
      setCampaigns(campRes.data);
      setTemplates(tempRes.data);
      setContacts(contRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    if (!selectedTemplate || selectedContacts.length === 0) {
      alert("Select a template and at least one contact.");
      return;
    }

    try {
      setSending(true);
      await apiClient.post('/messages/send-bulk', {
        template_id: selectedTemplate,
        contact_ids: selectedContacts
      });
      setSelectedTemplate('');
      setSelectedContacts([]);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to start campaign');
    } finally {
      setSending(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedContacts(contacts.map(c => c.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleToggleContact = (id) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(cId => cId !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const fetchCampaignLogs = async (id) => {
      try {
          // This is a placeholder for fetching specific campaign logs
          // In a full implementation, you'd show a modal or details pane
          const res = await apiClient.get(`/messages/campaigns/${id}/messages`);
          alert(`Fetched ${res.data.length} logs for this campaign.`);
      } catch (err) {
          console.error(err);
      }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Send size={24} className="text-whatsapp-dark" />
          Bulk Campaigns
        </h2>
        <p className="text-gray-500 text-sm mt-1">Send messages and view delivery status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Campaign Card */}
        <div className="glass p-6 rounded-xl space-y-5 lg:col-span-1 border-whatsapp-light border-t-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            Create Campaign
          </h3>
          <form onSubmit={handleSendCampaign} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">1. Select Template</label>
              <select 
                required 
                value={selectedTemplate}
                onChange={e => setSelectedTemplate(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm shadow-sm outline-none focus:ring-2 focus:ring-whatsapp-light"
              >
                <option value="" disabled>Choose a template...</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.language})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm font-medium text-gray-600">
                <span>2. Select Audience</span>
                <span className="text-xs bg-whatsapp-bg text-whatsapp-darker px-2 py-0.5 rounded-full font-bold">
                    {selectedContacts.length} Selected
                </span>
              </label>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white max-h-64 overflow-y-auto">
                <div className="p-2 border-b bg-gray-50 flex items-center gap-2 sticky top-0">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={contacts.length > 0 && selectedContacts.length === contacts.length}
                    className="rounded text-whatsapp-dark focus:ring-whatsapp-light cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-gray-600">Select All ({contacts.length})</span>
                </div>
                <div className="divide-y divide-gray-100">
                    {contacts.length === 0 ? (
                        <div className="p-4 text-center text-xs text-gray-400">No contacts available</div>
                    ) : (
                        contacts.map(c => (
                        <label key={c.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input 
                            type="checkbox" 
                            checked={selectedContacts.includes(c.id)}
                            onChange={() => handleToggleContact(c.id)}
                            className="rounded text-whatsapp-dark focus:ring-whatsapp-light"
                            />
                            <div>
                                <div className="text-sm font-medium text-gray-800">{c.name}</div>
                                <div className="text-xs text-gray-500 font-mono">{c.phone_number}</div>
                            </div>
                        </label>
                        ))
                    )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={sending || selectedContacts.length === 0 || !selectedTemplate}
              className="w-full bg-whatsapp-dark text-white rounded-lg py-3 font-semibold flex justify-center items-center gap-2 hover:bg-whatsapp-darker transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-whatsapp-light/20"
            >
              {sending ? (
                  <span className="animate-pulse flex items-center gap-2"><Clock size={18} /> Queuing...</span>
              ) : (
                  <><Send size={18} /> Dispatch Campaign</>
              )}
            </button>
          </form>
        </div>

        {/* Campaign History Log */}
        <div className="glass rounded-xl lg:col-span-2 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
          <div className="p-6 border-b border-gray-100 bg-white/50">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                Campaign History
            </h3>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-gray-50/50 sticky top-0 backdrop-blur-sm z-10">
                <tr>
                  <th className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</th>
                  <th className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Template</th>
                  <th className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider text-center">Volume</th>
                  <th className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-gray-500 animate-pulse">Loading campaigns...</td>
                  </tr>
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-12 text-gray-400">
                      <Send size={48} className="mx-auto mb-3 opacity-20" />
                      No campaigns sent yet. Send your first broadcast!
                    </td>
                  </tr>
                ) : (
                  campaigns.map(camp => {
                    const temp = templates.find(t => t.id === camp.template_id);
                    const tempName = temp ? temp.name : 'Unknown Template';
                    
                    // Simple status visualizer
                    let statusBadge;
                    if (camp.status === 'processing') statusBadge = <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-max"><Clock size={12}/> Processing</span>;
                    else if (camp.status === 'completed') statusBadge = <span className="bg-green-50 text-whatsapp-dark px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-max"><CheckCircle2 size={12}/> Completed</span>;
                    else statusBadge = <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-max">{camp.status}</span>;

                    return (
                      <tr key={camp.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-4 text-sm text-gray-600">
                            {new Date(camp.created_at).toLocaleDateString()}
                            <div className="text-xs text-gray-400">{new Date(camp.created_at).toLocaleTimeString()}</div>
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-800">{tempName}</td>
                        <td className="p-4 text-center">
                            <span className="bg-gray-100 text-gray-700 font-mono text-sm px-3 py-1 rounded-lg">{camp.total_messages}</span>
                        </td>
                        <td className="p-4">{statusBadge}</td>
                        <td className="p-4 text-right">
                            <button 
                                onClick={() => fetchCampaignLogs(camp.id)}
                                className="text-whatsapp-dark hover:bg-whatsapp-bg p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="View Delivery Logs"
                            >
                                <Eye size={18} />
                            </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Campaigns;
