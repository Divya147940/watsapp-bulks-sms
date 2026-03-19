import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Plus, Users } from 'lucide-react';
import apiClient from '../api/client';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [newContact, setNewContact] = useState({ name: '', phone_number: '', tags: '' });
  const [uploadResult, setUploadResult] = useState(null);

  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'bulk'
  const [manualList, setManualList] = useState(''); // For bulk manual entry

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleFileUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await apiClient.post('/contacts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadResult(res.data);
      setFile(null);
      fetchContacts();
    } catch (err) {
      console.error(err);
      alert('Failed to upload file. Check format and contents.');
    } finally {
      setUploading(false);
    }
  };

  const handleManualBulkEntry = async () => {
    if (!manualList.trim()) return;
    try {
        setUploading(true);
        const lines = manualList.split('\n');
        const batchContacts = lines.map(line => {
            const [name, phone, tags] = line.split(',').map(s => s.trim());
            return {
                name: name || 'Unknown',
                phone_number: phone || line.replace(/\D/g, ''),
                tags: tags ? tags.split('|').map(t => t.trim()) : []
            };
        }).filter(c => c.phone_number);

        const res = await apiClient.post('/contacts/batch', { contacts: batchContacts });
        setUploadResult(res.data);
        setManualList('');
        fetchContacts();
    } catch (err) {
        alert('Failed to process manual entries');
    } finally {
        setUploading(false);
    }
  };

  const handleCreateContact = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = newContact.tags.split(',').map(t => t.trim()).filter(t => t);
      await apiClient.post('/contacts', {
        name: newContact.name,
        phone_number: newContact.phone_number,
        tags: tagsArray
      });
      setNewContact({ name: '', phone_number: '', tags: '' });
      fetchContacts();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add contact');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await apiClient.delete(`/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users size={24} className="text-whatsapp-dark" />
            Contacts Management
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage your audience via file upload or manual entry</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('manual')}
          className={`px-6 py-2 font-medium text-sm transition-colors ${activeTab === 'manual' ? 'text-whatsapp-dark border-b-2 border-whatsapp-dark' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Manual Entry
        </button>
        <button 
          onClick={() => setActiveTab('bulk')}
          className={`px-6 py-2 font-medium text-sm transition-colors ${activeTab === 'bulk' ? 'text-whatsapp-dark border-b-2 border-whatsapp-dark' : 'text-gray-500 hover:text-gray-700'}`}
        >
          File Upload (CSV/Excel/JSON)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {activeTab === 'manual' ? (
          <>
            {/* Single Contact Card */}
            <div className="glass p-6 rounded-xl space-y-4 lg:col-span-1">
              <h3 className="font-semibold text-lg border-b pb-2">Single Contact</h3>
              <form onSubmit={handleCreateContact} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                  <input 
                    type="text" required value={newContact.name}
                    onChange={e => setNewContact({...newContact, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-whatsapp-light" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                  <input 
                    type="text" required value={newContact.phone_number}
                    onChange={e => setNewContact({...newContact, phone_number: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-whatsapp-light" 
                    placeholder="1234567890" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tags (comma separated)</label>
                  <input 
                    type="text" value={newContact.tags}
                    onChange={e => setNewContact({...newContact, tags: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-whatsapp-light" 
                    placeholder="vip, marketing" 
                  />
                </div>
                <button type="submit" className="w-full bg-gray-900 text-white rounded-lg py-2 flex justify-center items-center gap-2 text-sm hover:bg-gray-800 transition-colors">
                  <Plus size={16} /> Add Contact
                </button>
              </form>
            </div>

            {/* Manual Bulk Entry */}
            <div className="glass p-6 rounded-xl space-y-4 lg:col-span-2">
              <h3 className="font-semibold text-lg border-b pb-2">Quick Bulk Add</h3>
              <p className="text-xs text-gray-500">Enter contacts as: <code>Name, Phone, Tag1|Tag2</code> (one per line)</p>
              <textarea 
                value={manualList}
                onChange={e => setManualList(e.target.value)}
                className="w-full h-48 px-3 py-2 border rounded-lg text-sm font-mono outline-none focus:border-whatsapp-light resize-none"
                placeholder="John Doe, 1234567890, tagA|tagB&#10;Jane Smith, 0987654321"
              />
              <button 
                onClick={handleManualBulkEntry} 
                disabled={uploading || !manualList.trim()}
                className="w-full bg-whatsapp-dark text-white rounded-lg py-2 flex justify-center items-center gap-2 text-sm hover:bg-whatsapp-darker transition-colors disabled:opacity-50"
              >
                {uploading ? 'Processing...' : 'Add All to Contacts'}
              </button>
            </div>
          </>
        ) : (
          <div className="glass p-6 rounded-xl space-y-4 lg:col-span-3">
            <h3 className="font-semibold text-lg border-b pb-2">Upload File</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center space-y-3 bg-gray-50">
                <Upload size={40} className="mx-auto text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Supported formats: .csv, .xlsx, .json</p>
                  <p className="text-xs text-gray-500 mt-1">Files should contain 'name' and 'phone_number' columns.</p>
                </div>
                <input 
                  type="file" 
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-whatsapp-light file:text-white hover:file:bg-whatsapp-dark cursor-pointer mt-4"
                />
              </div>
              <div className="space-y-4 flex flex-col justify-center">
                <button 
                  onClick={handleFileUpload} 
                  disabled={!file || uploading}
                  className="w-full bg-whatsapp-dark text-white rounded-lg py-3 flex justify-center items-center gap-2 text-base font-semibold hover:bg-whatsapp-darker transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 shadow-md"
                >
                  {uploading ? 'Uploading...' : 'Process File'}
                </button>
                {file && <p className="text-center text-xs text-gray-600 font-medium">Selected: {file.name}</p>}
              </div>
            </div>
          </div>
        )}
        
        {/* Stats Card */}
        <div className="glass p-6 rounded-xl space-y-4 flex flex-col justify-center items-center lg:col-span-1 h-full">
            <div className="text-sm text-gray-500 font-medium tracking-wide uppercase">Total Audience</div>
            <div className="text-5xl font-bold text-whatsapp-dark">{contacts.length}</div>
            {uploadResult && (
              <div className={`mt-4 w-full p-3 rounded-lg text-xs text-center ${uploadResult.error_count > 0 ? 'bg-orange-50 text-orange-800 border border-orange-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
                Added: {uploadResult.success_count} | Failed: {uploadResult.error_count}
              </div>
            )}
        </div>
      </div>


      {/* Contacts Table */}
      <div className="glass rounded-xl overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600 text-sm">Name</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Phone Number</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Tags</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-gray-500">Loading contacts...</td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-gray-500">No contacts found. Add some above.</td>
                </tr>
              ) : (
                contacts.map(c => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-800">{c.name}</td>
                    <td className="p-4 text-sm text-gray-600 font-mono">{c.phone_number}</td>
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        {c.tags?.map((t, idx) => (
                          <span key={idx} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
