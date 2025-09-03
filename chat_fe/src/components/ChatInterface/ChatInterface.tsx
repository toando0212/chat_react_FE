import React from 'react';
import '@css/ChatInterface.css';
import ModelSelector from '@components/ChatInterface/components/ModelSelector';
import MessageList from '@components/ChatInterface/components/MessageList';
import ChatInputArea from '@components/ChatInterface/components/ChatInputArea';
import FileUploadInfo from '@components/ChatInterface/components/FileUploadInfo';
import useChatMessages from '@components/ChatInterface/hooks/useChatMessages';
import useFileUpload from '@components/ChatInterface/hooks/useFileUpload';
import useModelSelection from '@components/ChatInterface/hooks/useModelSelection';
import type { Model } from '@components/ChatInterface/types';

const API_URL = import.meta.env.VITE_API_URL;
const ENDPOINT = '/api/chat';
const FULL_API_URL = `${API_URL}${ENDPOINT}`;

const MODELS: Model[] = [
  { name: 'GPT-OSS 120B', value: 'gpt-oss-120b' },
  { name: 'LLaMA 3.3 70B', value: 'llama-3.3-70b' },
  { name: 'Qwen 3 32B', value: 'qwen-3-32b' },
];

const ChatInterface: React.FC = () => {
  const { messages, loading, setLoading, addMessage, messagesEndRef } = useChatMessages();
  const { uploadedFile, fileContent, error, handleFileUpload, removeUploadedFile } = useFileUpload();
  const { selectedModel, handleModelSelect } = useModelSelection(MODELS[0].value, MODELS);
  const [input, setInput] = React.useState('');
  const [fileInputKey, setFileInputKey] = React.useState(0);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed && !fileContent) return;
    setLoading(true);

    const userMessage = trimmed;
    const combinedInput = fileContent
      ? `${userMessage}\n\n[File content from ${uploadedFile?.name}:]\n${fileContent}`
      : userMessage;

    addMessage({ id: Date.now(), role: 'user', content: userMessage });
    setInput('');

    try {
      const formData = new FormData();
      formData.append('question', combinedInput);
      formData.append('model', selectedModel);
      const res = await fetch(FULL_API_URL, { method: 'POST', body: formData });
      const data = await res.json();

      // Remove <think> tags from the response (robust)
      const cleanAnswer = (data.answer || '').replace(/<think[^>]*>|<\/think>/gi, '');

      // Ensure assistant content keeps markdown/code formatting; push as-is
      addMessage({ id: Date.now(), role: 'assistant', content: cleanAnswer || 'No answer received.' });
      // If backend signaled file too large, clear uploaded file on FE
      if (data.error?.includes('exceeds') || data.error?.includes('exceed')) {
        // clear file info so it won't be sent/displayed
        removeUploadedFile();
      }
    } catch (err) {
      addMessage({ id: Date.now(), role: 'assistant', content: 'Sorry, something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <header className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
        <h1 className="h5 mb-0">AI Chatbot</h1>
        <ModelSelector models={MODELS} selectedModel={selectedModel} onModelSelect={handleModelSelect} />
      </header>

      <section className="chat-interface-section">
        <MessageList messages={messages} loading={loading} />
        <div ref={messagesEndRef} />
      </section>

      <footer className="chat-interface-footer">
        {error && <div className="alert alert-danger">{error}</div>}
        <ChatInputArea input={input} setInput={setInput} onSend={sendMessage} loading={loading} />
        <div className="file-upload">
          <input
            type="file"
            accept=".js,.ts,.tsx,.jsx,.css,.html"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const accepted = handleFileUpload(file);
              if (!accepted) {
                // clear the input element so filename won't remain visible
                try {
                  if (fileInputRef.current) fileInputRef.current.value = '';
                } catch (err) {
                  (e.target as HTMLInputElement).value = '';
                }
                // ensure uploadedFile state is cleared too
                removeUploadedFile();
                // force re-create the input element to ensure browser doesn't show filename
                setFileInputKey((k) => k + 1);
              }
            }}
            key={fileInputKey}
          />
          <FileUploadInfo uploadedFile={uploadedFile} onFileRemove={removeUploadedFile} />
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;