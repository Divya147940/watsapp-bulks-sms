import React, { useState, useEffect } from 'react';
import { LayoutTemplate, Plus, Trash2, Globe, Tag } from 'lucide-react';
import apiClient from '../api/client';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newTemplate, setNewTemplate] = useState({ 
    name: '', 
    language: 'en_US', 
    category: 'MARKETING', 
    body: '' 
  });

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/templates');
      setTemplates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      // In a real app, parse variables from the body e.g., {{1}}, {{2}}
      await apiClient.post('/templates', {
        ...newTemplate,
        variables: []
      });
      setNewTemplate({ name: '', language: 'en_US', category: 'MARKETING', body: '' });
      fetchTemplates();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add template');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await apiClient.delete(`/templates/${id}`);
      fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <LayoutTemplate size={24} className="text-whatsapp-dark" />
          Message Templates
        </h2>
        <p className="text-gray-500 text-sm mt-1">Pre-approved templates for bulk sending</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Add Template Card */}
        <div className="glass p-6 rounded-xl space-y-4 shadow-sm lg:sticky top-6">
          <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
            <Plus size={18} /> New Template
          </h3>
          <form onSubmit={handleCreateTemplate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Template Name (from Meta)</label>
              <input 
                type="text" required value={newTemplate.name}
                onChange={e => setNewTemplate({...newTemplate, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-whatsapp-light font-mono" 
                placeholder="hello_world" 
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Language Code</label>
                <input 
                  type="text" required value={newTemplate.language}
                  onChange={e => setNewTemplate({...newTemplate, language: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-whatsapp-light font-mono" 
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                <select 
                  value={newTemplate.category}
                  onChange={e => setNewTemplate({...newTemplate, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-whatsapp-light bg-white"
                >
                  <option value="MARKETING">MARKETING</option>
                  <option value="UTILITY">UTILITY</option>
                  <option value="AUTHENTICATION">AUTHENTICATION</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Message Body (Reference)</label>
              <textarea 
                required value={newTemplate.body}
                onChange={e => setNewTemplate({...newTemplate, body: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-whatsapp-light min-h-[120px]" 
                placeholder="Hello {{1}}, welcome to our service!" 
              />
            </div>
            <button type="submit" className="w-full bg-whatsapp-dark text-white rounded-lg py-2 flex justify-center items-center gap-2 text-sm hover:bg-whatsapp-darker transition-colors font-medium">
              Save Template
            </button>
          </form>
        </div>

        {/* Templates List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center p-8 text-gray-500">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="glass text-center p-12 text-gray-500 rounded-xl">
              No templates found. Add your Meta pre-approved templates here.
            </div>
          ) : (
            templates.map(t => (
              <div key={t.id} className="glass rounded-xl p-5 hover:border-whatsapp-light transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-whatsapp-bg rounded-bl-full -z-10 opacity-50 group-hover:bg-whatsapp-light group-hover:opacity-10 transition-colors"></div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-lg text-gray-800 tracking-tight">{t.name}</h4>
                    <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">{t.category}</span>
                  </div>
                  <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <p className="text-gray-700 whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-100 text-sm">{t.body}</p>
                
                <div className="flex gap-4 mt-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5"><Globe size={14} className="text-gray-400" /> {t.language}</span>
                  <span className="flex items-center gap-1.5"><Tag size={14} className="text-gray-400" /> {t.variables?.length || 0} variables</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Templates;
