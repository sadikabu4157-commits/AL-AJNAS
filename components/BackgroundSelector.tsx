import React, { useState } from 'react';

interface Background {
  name: string;
  url: string;
}

interface BackgroundSelectorProps {
  backgrounds: Background[];
  currentBackground: string;
  onSelect: (url: string) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ backgrounds, currentBackground, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (url: string) => {
    onSelect(url);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-yellow-400 hover:bg-yellow-400/20 transition-colors"
        aria-label="Change background"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl z-20">
          <ul className="p-2 space-y-1">
            {backgrounds.map((bg) => (
              <li key={bg.name}>
                <button
                  onClick={() => handleSelect(bg.url)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    currentBackground === bg.url ? 'bg-yellow-500/30 text-yellow-300' : 'text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <img src={`${bg.url.replace('/1920/1080', '/50/50')}`} alt={bg.name} className="w-6 h-6 rounded object-cover border border-yellow-700"/>
                  <span>{bg.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BackgroundSelector;
