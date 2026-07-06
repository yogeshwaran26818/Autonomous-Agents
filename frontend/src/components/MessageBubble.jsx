import React from 'react';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`message-wrapper ${isUser ? 'user' : 'assistant'}`}>
      <div className={`avatar ${isUser ? 'user' : 'assistant'}`}>
        {isUser ? 'U' : 'AI'}
      </div>
      <div className="message-bubble">
        {isUser ? (
          <div>{message.message}</div>
        ) : (
          <ReactMarkdown>{message.message}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
