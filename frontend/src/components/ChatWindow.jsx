import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ExecutionPlan from './ExecutionPlan';
import DocumentPreview from './DocumentPreview';
import api from '../services/api';

const ChatWindow = ({ currentSessionId, onSessionUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState([]);
  const [documents, setDocuments] = useState([]);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (currentSessionId) {
      fetchSessionData();
    } else {
      setMessages([{
        role: 'assistant',
        message: 'Hello! I am your Autonomous AI Agent. I can plan tasks and generate professional documents for you. How can I help you today?'
      }]);
      setPlan([]);
      setDocuments([]);
    }
  }, [currentSessionId]);

  const fetchSessionData = async () => {
    try {
      const response = await api.get(`/history/${currentSessionId}`);
      setMessages(response.data.history || []);
      setPlan(response.data.execution_plan || []);
      setDocuments(response.data.generated_documents || []);
    } catch (error) {
      console.error("Failed to fetch session", error);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, plan, documents, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', message: userMessage }]);
    setIsLoading(true);
    setPlan([
      { step_number: 1, description: "Understand Request", status: "Running" },
      { step_number: 2, description: "Retrieve Conversation Memory", status: "Pending" },
      { step_number: 3, description: "Generate Plan", status: "Pending" },
      { step_number: 4, description: "Execute Tasks", status: "Pending" },
      { step_number: 5, description: "Generate Document", status: "Pending" },
      { step_number: 6, description: "Save Memory", status: "Pending" }
    ]);

    try {
      const response = await api.post('/agent', {
        request: userMessage,
        session_id: currentSessionId
      });
      
      const data = response.data;
      setMessages(prev => [...prev, { role: 'assistant', message: data.response }]);
      setPlan(data.execution_plan);
      
      if (data.document_name) {
        setDocuments(prev => [...prev, data.document_name]);
      }
      
      if (!currentSessionId) {
        onSessionUpdate(data.session_id);
      }
    } catch (error) {
      console.error("Agent error", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        message: 'An error occurred while processing your request. Please try again.' 
      }]);
      // Reset plan to failed
      setPlan(prevPlan => prevPlan.map(p => ({ ...p, status: p.status === 'Running' ? 'Failed' : 'Pending' })));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, fontSize: '1.125rem' }}>
          <Bot color="var(--primary-color)" />
          Autonomous AI Agent
        </div>
      </div>

      <div className="chat-container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
          
          {(isLoading || plan.length > 0) && (
            <div className="message-wrapper assistant" style={{ marginBottom: '1rem' }}>
              <div className="avatar assistant">AI</div>
              <div style={{ width: '100%', maxWidth: '80%' }}>
                <ExecutionPlan plan={plan} />
              </div>
            </div>
          )}

          {documents.map((docName, idx) => (
            <div key={idx} className="message-wrapper assistant" style={{ marginBottom: '1rem' }}>
              <div className="avatar assistant">AI</div>
              <div style={{ width: '100%', maxWidth: '80%' }}>
                <DocumentPreview documentName={docName} />
              </div>
            </div>
          ))}

          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="input-area">
        <form className="prompt-container" onSubmit={handleSubmit}>
          <textarea
            className="prompt-input"
            placeholder="Send a message to the AI agent..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={1}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="send-btn"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          AI can make mistakes. Consider verifying important information.
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
