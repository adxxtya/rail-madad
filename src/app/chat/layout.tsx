// src/app/layouts/ChatLayout.tsx
import React from 'react';

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col h-screen bg-white">
            {children}
        </div>
    );
};

export default ChatLayout;