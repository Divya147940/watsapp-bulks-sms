import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BulkSend from './pages/BulkSend';
import EntryHub from './pages/EntryHub';
import SetupGuide from './pages/SetupGuide';
import ActivationSuccess from './pages/ActivationSuccess';
import Dashboard from './pages/Dashboard';
import ChatbotConfig from './pages/ChatbotConfig';
import SetupSelection from './pages/SetupSelection';
import AssistedSetupForm from './pages/AssistedSetupForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Routes>
          <Route path="/" element={<EntryHub />} />
          <Route path="/setup-selection" element={<SetupSelection />} />
          <Route path="/setup-guide" element={<SetupGuide />} />
          <Route path="/assisted-setup-form" element={<AssistedSetupForm />} />
          <Route path="/activation-success" element={<ActivationSuccess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chatbot-config" element={<ChatbotConfig />} />
          <Route path="/bulk-send" element={<BulkSend />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;


