import React from 'react';

interface ChatInputAreaProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  loading: boolean;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({ input, setInput, onSend, loading }) => {
  return (
    <div className="input-area">
      <textarea
        className="input"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
      />
      <button className="send-button" onClick={onSend} disabled={loading || !input.trim()}>
        ↑
      </button>
    </div>
  );
};

export default ChatInputArea;
