import { ReactWidget } from '@jupyterlab/apputils';
import React, { useState, useRef, useEffect } from 'react';

const PLANCKTON_API = '/api/planckton';

interface ChatMessage {
  sender: 'user' | 'planckton';
  text: string;
}

const PlancktonPanel = (): JSX.Element => {
  console.log('[Planckton] PlancktonPanel React component rendered');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto'; // reset first
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = Math.min(scrollHeight, 200) + 'px';
    }
  }, [input]);
  

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { sender: 'user', text: input };
    setInput('');
    setLoading(true);
    // Prepare the full history including the new user message
    const fullHistory = [...messages, userMsg];
    console.log('[Planckton] Sending history:', fullHistory);
    try {
      const res = await fetch(PLANCKTON_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: fullHistory, context: {} }),
        credentials: 'same-origin',
      });
      const data = await res.json();
      console.log('[Planckton] Received response:', data);
      setMessages([...fullHistory, { sender: 'planckton', text: data.reply || 'No response.' }]);
    } catch (e) {
      console.error('[Planckton] Error:', e);
      setMessages([...fullHistory, { sender: 'planckton', text: 'Error contacting Planckton.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Copy code to clipboard
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  // Function to format message text with proper code blocks
  const formatMessage = (text: string) => {
    // Split by code blocks (```language ... ```)
    const parts = text.split(/(```[\w]*\n[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        // Extract language and code
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        if (match) {
          const [, language, code] = match;
          return (
            <div key={index} className="jp-PlancktonPanel-code-block">
              <div className="jp-PlancktonPanel-code-block-header">
                <button
                  className="jp-PlancktonPanel-copy-btn"
                  title="Copy code"
                  onClick={() => handleCopy(code)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <rect x="6" y="6" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                </button>
              </div>
              {language && <div className="jp-PlancktonPanel-code-language">{language}</div>}
              <pre className="jp-PlancktonPanel-code">
                <code>{code}</code>
              </pre>
            </div>
          );
        }
      }
      // Regular text - split by newlines and preserve formatting
      return (
        <div key={index} className="jp-PlancktonPanel-text">
          {part.split('\n').map((line, lineIndex) => (
            <div key={lineIndex}>{line || '\u00A0'}</div>
          ))}
        </div>
      );
    });
  };

  return (
    <div className="jp-PlancktonPanel">
      <div className="jp-PlancktonPanel-header">
        <div className="jp-PlancktonPanel-header-title">
          <span className="jp-PlancktonPanel-header-icon">Ψ</span>
          planckton -  your ai assistant for quantum coding
        </div>
      </div>
      <div className="jp-PlancktonPanel-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`jp-PlancktonPanel-msg jp-PlancktonPanel-msg-${msg.sender}`}>
            <div className="jp-PlancktonPanel-msg-header">
              <span className="jp-PlancktonPanel-msg-sender">
                {msg.sender === 'user' ? 'You' : 'Planckton'}
              </span>
            </div>
            <div className="jp-PlancktonPanel-msg-content">
              {formatMessage(msg.text)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="jp-PlancktonPanel-msg jp-PlancktonPanel-msg-planckton">
            <div className="jp-PlancktonPanel-msg-header">
              <span className="jp-PlancktonPanel-msg-sender">Planckton</span>
            </div>
            <div className="jp-PlancktonPanel-msg-content">
              <div className="jp-PlancktonPanel-thinking">
                <span className="jp-PlancktonPanel-thinking-dots">
                  <span></span><span></span><span></span>
                </span>
                Thinking...
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="jp-PlancktonPanel-input">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { 
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage(); 
            }
          }}
          placeholder="Ask Planckton..."
          disabled={loading}
          rows={1}
          className="jp-PlancktonPanel-textarea"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="jp-PlancktonPanel-send-btn"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export namespace PlancktonComponent {
  export const create = (): ReactWidget => {
    return ReactWidget.create(<PlancktonPanel />);
  };
} 