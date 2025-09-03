import React from 'react';
import ChatInterface from '@components/ChatInterface/ChatInterface';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import '@css/App.css'; // Updated to use alias for CSS import

const App: React.FC = () => {
  return <ChatInterface />;
};

export default App;
