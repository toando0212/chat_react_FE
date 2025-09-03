import React from 'react';
import type { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

const copyToClipboard = async (text: string) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
};

// Function to process markdown content to handle code blocks properly
const processMarkdown = (content: string) => {
  // Extract code blocks
  const codeBlockRegex = /```([\w]*)\n([\s\S]*?)```/g;
  let match;
  let lastIndex = 0;
  const segments = [];

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: content.substring(lastIndex, match.index)
      });
    }
    
    // Add code block
    segments.push({
      type: 'code',
      language: match[1] || '',
      content: match[2].trim()
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      content: content.substring(lastIndex)
    });
  }
  
  return segments;
};

// Standalone component for code blocks
const CodeBlock: React.FC<{ content: string; language?: string }> = ({ content, language }) => {
  return (
    <div className="code-block-container">
      <pre className={language ? `language-${language}` : 'code-block'}>
        <button 
          className="code-copy-overlay" 
          onClick={() => copyToClipboard(content)} 
          title="Copy code"
        >
          Copy
        </button>
        <code>{content}</code>
      </pre>
    </div>
  );
};

const safeString = (val: any) => {
  if (typeof val === 'string') return val;
  if (val === undefined || val === null) return '';
  try {
    return JSON.stringify(val, null, 2);
  } catch {
    return String(val);
  }
};

const MessageList: React.FC<MessageListProps> = ({ messages, loading }) => {
  return (
    <div className="message-container" role="log" aria-live="polite">
      {messages.map((m) => {
        // Sanitize content
        const content = safeString(m.content);
        const sanitized = m.role === 'assistant' 
          ? content.replace(/<think[^>]*>|<\/think>/gi, '')
          : content;
        
        return (
          <div key={m.id} className={`message ${m.role}`}>
            {m.role === 'assistant' && <div className="rounded-circle bg-primary text-white">🤖</div>}
            <div className={`message-bubble ${m.role}`}>
              <div className="message-content">
                {m.role === 'assistant' ? (
                  // For assistant messages, process markdown content
                  <>
                    {processMarkdown(sanitized).map((segment, index) => (
                      <React.Fragment key={index}>
                        {segment.type === 'text' ? (
                          // Regular text rendered as markdown
                          <ReactMarkdown 
                            rehypePlugins={[rehypeHighlight, rehypeRaw]}
                            components={{
                              code: (props: any) => {
                                const { inline, children } = props;
                                if (inline) return <code className="inline-code">{children}</code>;
                                return null; // Code blocks are handled separately
                              }
                            }}
                          >
                            {segment.content}
                          </ReactMarkdown>
                        ) : (
                          // Code blocks rendered separately
                          <CodeBlock 
                            content={segment.content}
                            language={segment.language}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  // For user messages, render plain text
                  <div>{sanitized}</div>
                )}
              </div>
            </div>
            {m.role === 'user' && <div className="rounded-circle bg-secondary text-white">👤</div>}
          </div>
        );
      })}
      {loading && <div className="spinner">Loading...</div>}
    </div>
  );
};

export default MessageList;
