import { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';

const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  return { messages, loading, setLoading, addMessage, messagesEndRef };
};

export default useChatMessages;
