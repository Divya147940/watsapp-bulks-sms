import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BulkSend from './pages/BulkSend';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Routes>
          <Route path="/" element={<BulkSend />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;


