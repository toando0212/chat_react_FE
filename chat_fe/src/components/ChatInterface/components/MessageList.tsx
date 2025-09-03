import React from 'react';
import type { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading }) => {
  return (
    <div className="message-container" role="log" aria-live="polite">
      {messages.map((m) => (
        <div key={m.id} className={`message ${m.role}`}>
          {m.role === 'assistant' && <div className="rounded-circle bg-primary text-white">🤖</div>}
          <div className={`message-bubble ${m.role}`}>
            {m.role === 'assistant' ? (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{m.content}</ReactMarkdown>
            ) : (
              <div>{m.content}</div>
            )}
          </div>
          {m.role === 'user' && <div className="rounded-circle bg-secondary text-white">👤</div>}
        </div>
      ))}
      {loading && <div className="spinner">Loading...</div>}
    </div>
  );
};

export default MessageList;
