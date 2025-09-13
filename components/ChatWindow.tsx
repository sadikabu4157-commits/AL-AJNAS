
import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-grow overflow-y-auto p-6 space-y-6">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && messages[messages.length - 1]?.sender === 'user' && (
         <div className="flex items-start gap-4 justify-start">
             <div className="w-10 h-10 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center border-2 border-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
             </div>
             <div className="max-w-xl rounded-2xl p-4 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-bl-none border border-gray-700 flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse mr-2"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-75 mr-2"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-150"></div>
             </div>
         </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatWindow;
