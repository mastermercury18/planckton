import { ReactWidget } from '@jupyterlab/apputils';
import React, { useState, useRef, useEffect } from 'react';
const PLANCKTON_API = '/api/planckton';
const PlancktonPanel = () => {
    console.log('[Planckton] PlancktonPanel React component rendered');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef(null);
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
        if (!input.trim())
            return;
        const userMsg = { sender: 'user', text: input };
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
        }
        catch (e) {
            console.error('[Planckton] Error:', e);
            setMessages([...fullHistory, { sender: 'planckton', text: 'Error contacting Planckton.' }]);
        }
        finally {
            setLoading(false);
        }
    };
    // Copy code to clipboard
    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
    };
    // Function to format message text with proper code blocks
    const formatMessage = (text) => {
        // Split by code blocks (```language ... ```)
        const parts = text.split(/(```[\w]*\n[\s\S]*?```)/g);
        return parts.map((part, index) => {
            if (part.startsWith('```')) {
                // Extract language and code
                const match = part.match(/```(\w*)\n([\s\S]*?)```/);
                if (match) {
                    const [, language, code] = match;
                    return (React.createElement("div", { key: index, className: "jp-PlancktonPanel-code-block" },
                        React.createElement("div", { className: "jp-PlancktonPanel-code-block-header" },
                            React.createElement("button", { className: "jp-PlancktonPanel-copy-btn", title: "Copy code", onClick: () => handleCopy(code) },
                                React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                                    React.createElement("rect", { x: "3", y: "3", width: "10", height: "10", rx: "2", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }),
                                    React.createElement("rect", { x: "6", y: "6", width: "7", height: "7", rx: "1.5", stroke: "currentColor", strokeWidth: "1.5", fill: "none" })))),
                        language && React.createElement("div", { className: "jp-PlancktonPanel-code-language" }, language),
                        React.createElement("pre", { className: "jp-PlancktonPanel-code" },
                            React.createElement("code", null, code))));
                }
            }
            // Regular text - split by newlines and preserve formatting
            return (React.createElement("div", { key: index, className: "jp-PlancktonPanel-text" }, part.split('\n').map((line, lineIndex) => (React.createElement("div", { key: lineIndex }, line || '\u00A0')))));
        });
    };
    return (React.createElement("div", { className: "jp-PlancktonPanel" },
        React.createElement("div", { className: "jp-PlancktonPanel-header" },
            React.createElement("div", { className: "jp-PlancktonPanel-header-title" },
                React.createElement("span", { className: "jp-PlancktonPanel-header-icon" }, "\u03A8"),
                "planckton -  your ai assistant for quantum coding")),
        React.createElement("div", { className: "jp-PlancktonPanel-messages" },
            messages.map((msg, i) => (React.createElement("div", { key: i, className: `jp-PlancktonPanel-msg jp-PlancktonPanel-msg-${msg.sender}` },
                React.createElement("div", { className: "jp-PlancktonPanel-msg-header" },
                    React.createElement("span", { className: "jp-PlancktonPanel-msg-sender" }, msg.sender === 'user' ? 'You' : 'Planckton')),
                React.createElement("div", { className: "jp-PlancktonPanel-msg-content" }, formatMessage(msg.text))))),
            loading && (React.createElement("div", { className: "jp-PlancktonPanel-msg jp-PlancktonPanel-msg-planckton" },
                React.createElement("div", { className: "jp-PlancktonPanel-msg-header" },
                    React.createElement("span", { className: "jp-PlancktonPanel-msg-sender" }, "Planckton")),
                React.createElement("div", { className: "jp-PlancktonPanel-msg-content" },
                    React.createElement("div", { className: "jp-PlancktonPanel-thinking" },
                        React.createElement("span", { className: "jp-PlancktonPanel-thinking-dots" },
                            React.createElement("span", null),
                            React.createElement("span", null),
                            React.createElement("span", null)),
                        "Thinking..."))))),
        React.createElement("div", { className: "jp-PlancktonPanel-input" },
            React.createElement("textarea", { ref: textareaRef, value: input, onChange: e => setInput(e.target.value), onKeyDown: e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                }, placeholder: "Ask Planckton...", disabled: loading, rows: 1, className: "jp-PlancktonPanel-textarea" }),
            React.createElement("button", { onClick: sendMessage, disabled: loading || !input.trim(), className: "jp-PlancktonPanel-send-btn" }, "Send"))));
};
export var PlancktonComponent;
(function (PlancktonComponent) {
    PlancktonComponent.create = () => {
        return ReactWidget.create(React.createElement(PlancktonPanel, null));
    };
})(PlancktonComponent || (PlancktonComponent = {}));
