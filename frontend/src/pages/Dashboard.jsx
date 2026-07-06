import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

const Dashboard = () => {
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const handleSessionUpdate = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  return (
    <div className="app-container">
      <Sidebar 
        currentSessionId={currentSessionId} 
        onSelectSession={setCurrentSessionId} 
      />
      <ChatWindow 
        currentSessionId={currentSessionId} 
        onSessionUpdate={handleSessionUpdate} 
      />
    </div>
  );
};

export default Dashboard;
