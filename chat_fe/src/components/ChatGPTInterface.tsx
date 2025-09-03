import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

const API_URL = import.meta.env.VITE_API_URL;
const ENDPOINT = '/api/chat';
const FULL_API_URL = `${API_URL}${ENDPOINT}`;

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

const ChatGPTInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(1);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
    setError(null);

    if (file) {
      if (file.size > 5 * 1024) {
        setError('File exceeds 5KB.');
        setUploadedFile(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
      };
      reader.onerror = () => {
        setError('Could not read file. Please try again.');
        setUploadedFile(null);
      };
      reader.readAsText(file);
    }
  };

  const sendMessage = async (text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed && !fileContent) {
      setError('Please enter a message or upload a file.');
      return;
    }

    setLoading(true);
    setError(null);

    const userMessage = trimmed;
    const combinedInput = fileContent
      ? `${userMessage}\n\n[File content from ${uploadedFile?.name}:]\n${fileContent}`
      : userMessage;

    const userMsg: Message = { id: idRef.current++, role: 'user', content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const formData = new FormData();
      formData.append('question', combinedInput);
      const cleanedUrl = FULL_API_URL.trim();
      const res = await axios.post(cleanedUrl, formData);

      const aiContent = res?.data?.answer ?? 'No answer received.';
      const aiMsg: Message = { id: idRef.current++, role: 'assistant', content: aiContent };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg: Message = {
        id: idRef.current++,
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
      };
      setMessages((prev) => [...prev, errMsg]);

      if (axios.isAxiosError(err)) {
        console.error('sendMessage error', {
          message: err.message,
          code: err.code,
          config: err.config,
          request: err.request,
          response: err.response,
        });
      } else {
        console.error('sendMessage error', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <header className="bg-dark text-white p-3 text-center">
        <h1 className="h5 mb-0">AI Chatbot</h1>
      </header>

      <section className="flex-grow-1 overflow-auto p-3 bg-light" style={{ flex: '1', overflowY: 'auto' }}>
        <div className="d-flex flex-column gap-3" role="log" aria-live="polite" style={{ maxWidth: '100%' }}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`d-flex align-items-end gap-3 ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white" style={{ width: '36px', height: '36px' }}>
                  🤖
                </div>
              )}

              <div
                className={`p-3 rounded shadow-sm border ${
                  m.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white text-dark'
                }`}
                style={{ maxWidth: '66%', overflowWrap: 'break-word' }}
              >
                {m.role === 'assistant' ? (
                  <div className="message-content">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div>{m.content}</div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white" style={{ width: '36px', height: '36px' }}>
                  👤
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white" style={{ width: '36px', height: '36px' }}>
                🤖
              </div>
              <div className="d-flex align-items-center gap-2 p-3 rounded shadow-sm border bg-white">
                <div className="spinner-border text-secondary" role="status" style={{ width: '1rem', height: '1rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div>Thinking...</div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </section>

      <footer className="p-3 border-top bg-white" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {error && <div className="alert alert-danger">{error}</div>}
        <textarea
          className="form-control"
          placeholder="Type your message... (Enter to send, Shift+Enter for newline)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={loading}
          style={{ resize: 'none', minHeight: '46px', maxHeight: '140px' }}
        />
        <input
          type="file"
          accept=".js,.ts,.tsx,.jsx,.css,.scss,.html"
          onChange={handleFileUpload}
          className="form-control"
        />
        <button
          className="btn btn-dark"
          onClick={() => sendMessage()}
          disabled={loading || (!input.trim() && !fileContent)}
          style={{ minWidth: '80px' }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </footer>
    </div>
  );
};

export default ChatGPTInterface;
