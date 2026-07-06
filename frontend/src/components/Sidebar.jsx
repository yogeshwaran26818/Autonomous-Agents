import React, { useEffect, useState } from 'react';
import { Plus, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const Sidebar = ({ onSelectSession, currentSessionId }) => {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, [currentSessionId]);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/history');
      setSessions(response.data);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    }
  };

  return (
    <div className="sidebar">
      <button 
        className="btn btn-outline" 
        style={{ width: '100%', marginBottom: '1.5rem', justifyContent: 'flex-start' }}
        onClick={() => onSelectSession(null)}
      >
        <Plus size={18} />
        New Chat
      </button>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
          Previous Conversations
        </div>
        
        {sessions.map((session) => (
          <button
            key={session.session_id}
            className={`btn ${currentSessionId === session.session_id ? 'btn-primary' : 'btn-outline'}`}
            style={{ 
              width: '100%', 
              justifyContent: 'flex-start', 
              marginBottom: '0.5rem', 
              border: 'none',
              backgroundColor: currentSessionId === session.session_id ? 'var(--user-msg-bg)' : 'transparent',
              color: 'var(--text-primary)'
            }}
            onClick={() => onSelectSession(session.session_id)}
          >
            <MessageSquare size={16} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {session.history[0]?.message || 'New Chat'}
            </span>
          </button>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div className="avatar user">{user?.sub?.[0]?.toUpperCase() || 'U'}</div>
          <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.sub || 'User'}</div>
        </div>
        <button 
          className="btn btn-outline" 
          style={{ width: '100%', color: 'var(--error-color)', borderColor: 'transparent' }}
          onClick={logout}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
