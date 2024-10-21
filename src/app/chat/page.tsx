// src/app/chat/page.tsx
"use client"; // This line marks the component as a Client Component

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';  // Import the markdown renderer
import remarkGfm from 'remark-gfm';  // For GitHub-flavored markdown (e.g., tables, strikethrough, etc.)

const ChatPage = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'gemini' }[]>([]);

    const sendMessage = async () => {
        if (!message) return;

        // Add user message to messages state
        setMessages(prev => [...prev, { text: message, sender: 'user' }]);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            
            // Add Rail Madad AI's response to messages state
            if (data.generated_text) {
                setMessages(prev => [...prev, { text: data.generated_text, sender: 'gemini' }]);
            } else {
                setMessages(prev => [...prev, { text: "No response from Rail Madad AI.", sender: 'gemini' }]);
            }
            
            // Clear input field
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { text: "Error sending message.", sender: 'gemini' }]);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-black">
            <header className="bg-purple-600 text-white p-4 shadow-md">
                <h1 className="text-xl font-bold">Rail Madad AI Chat Assistance</h1>
            </header>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            msg.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`p-3 rounded-lg max-w-xs ${
                                msg.sender === 'user'
                                    ? 'bg-[#9c1f6b] text-white' // Beetroot for user
                                    : 'bg-[#7b1c5b] text-white' // Slightly darker beetroot for Rail Madad AI
                            }`}
                        >
                            <strong>{msg.sender === 'user' ? 'You:' : 'Rail Madad AI:'}</strong> 
                            <div className="markdown">
                                {/* Render markdown content here */}
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.text}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex p-4 border-t border-gray-300 bg-black">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white bg-gray-800"
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition duration-200"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
