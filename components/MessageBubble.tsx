import React, { useState } from 'react';
import type { Message } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!message.text) return;
    navigator.clipboard.writeText(message.text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-10 h-10 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center border-2 border-yellow-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      )}
      <div
        className={`relative max-w-xl rounded-2xl p-4 text-white shadow-lg ${
          isUser
            ? 'bg-blue-800 rounded-br-none'
            : 'bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-bl-none border border-gray-700'
        }`}
      >
        {!isUser && message.text && (
            <button 
                onClick={handleCopy} 
                className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-900/50 hover:bg-gray-700/70 text-gray-400 hover:text-white transition-colors duration-200"
                aria-label={isCopied ? "Copied" : "Copy text"}
            >
                {isCopied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                )}
            </button>
        )}
        {message.imageUrl && (
          <div className="mb-2">
            <img
              src={message.imageUrl}
              alt={isUser ? "User upload" : "Generated Seal"}
              className="rounded-lg border-2 border-yellow-500 shadow-2xl shadow-yellow-500/20 max-h-64"
            />
          </div>
        )}
        {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
        {message.isGeneratingImage && (
          <div className="mt-4 p-3 bg-gray-900 rounded-lg flex items-center gap-3 text-yellow-400">
            <LoadingSpinner />
            <span>Forging the sacred seal...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
