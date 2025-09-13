import React, { useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface InputBarProps {
  userInput: string;
  setUserInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  uploadedImage: { dataUrl: string; mimeType: string } | null;
  setUploadedImage: (image: { dataUrl: string; mimeType: string } | null) => void;
}

const InputBar: React.FC<InputBarProps> = ({ userInput, setUserInput, handleSubmit, isLoading, uploadedImage, setUploadedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && (userInput.trim() || uploadedImage)) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage({
          dataUrl: reader.result as string,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
     // Reset file input value to allow re-uploading the same file
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const canSubmit = !isLoading && (userInput.trim() || uploadedImage);

  return (
    <div className="p-4 bg-gray-900/50 border-t border-gray-700">
      <div className="max-w-4xl mx-auto">
        {uploadedImage && (
          <div className="mb-2 p-2 bg-gray-800/50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={uploadedImage.dataUrl} alt="Upload preview" className="w-12 h-12 rounded object-cover" />
              <span className="text-sm text-gray-400">Image attached</span>
            </div>
            <button
              onClick={() => setUploadedImage(null)}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-start bg-gray-800 rounded-xl shadow-lg border border-gray-600">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-4 text-gray-400 hover:text-yellow-400 disabled:text-gray-600"
            aria-label="Attach image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
            capture="environment"
          />
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the secrets of Al-Ajnas..."
            className="flex-grow bg-transparent p-4 text-white placeholder-gray-400 resize-none focus:outline-none self-center"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="p-4 text-yellow-400 hover:text-white disabled:text-gray-500 disabled:cursor-not-allowed transition-colors self-center"
          >
            {isLoading ? (
              <LoadingSpinner className="w-6 h-6"/>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputBar;
