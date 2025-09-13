import React, { useState, useEffect } from 'react';
import type { Message } from './types';
import { Part } from "@google/genai";
import { INITIAL_MESSAGES, BACKGROUND_THEMES } from './constants';
import { getExplanation, generateSealImage } from './services/geminiService';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import BackgroundSelector from './components/BackgroundSelector';

const dataUrlToGeminiPart = (dataUrl: string, mimeType: string): Part => {
  return {
    inlineData: {
      data: dataUrl.split(',')[1],
      mimeType: mimeType,
    },
  };
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{ dataUrl: string; mimeType: string } | null>(null);

  const getDefaultBackground = () => {
    return localStorage.getItem('grimoire-background') || BACKGROUND_THEMES[0].url;
  };

  const [background, setBackground] = useState(getDefaultBackground());

  useEffect(() => {
    localStorage.setItem('grimoire-background', background);
  }, [background]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() && !uploadedImage) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userInput,
      imageUrl: uploadedImage?.dataUrl || null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setUploadedImage(null);
    setIsLoading(true);

    try {
      const imagePart = uploadedImage ? dataUrlToGeminiPart(uploadedImage.dataUrl, uploadedImage.mimeType) : null;
      const aiTextResponse = await getExplanation(userInput, imagePart);
      
      const imageGenRegex = /\[GENERATE_IMAGE: (.*?)\]/;
      const imageMatch = aiTextResponse.match(imageGenRegex);
      
      const cleanedText = aiTextResponse.replace(imageGenRegex, '').trim();

      const aiMessageId = `ai-${Date.now()}`;
      const aiMessage: Message = {
        id: aiMessageId,
        sender: 'ai',
        text: cleanedText,
        imageUrl: null,
        isGeneratingImage: !!imageMatch,
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (imageMatch && imageMatch[1]) {
        const imagePrompt = imageMatch[1];
        const imageUrl = await generateSealImage(imagePrompt);
        
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, imageUrl, isGeneratingImage: false }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: "An unforeseen disturbance has occurred. I cannot answer at this time.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg-gray-900 text-gray-200 h-screen w-screen flex flex-col bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url('${background}')` }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <main className="relative z-10 flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <div className="flex-1"></div>
          <div className="flex-1 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 font-cinzel tracking-widest text-shadow-lg">
              Al-Ajnas AI Grimoire
            </h1>
            <p className="text-yellow-600 font-cinzel text-sm">The Unveiled Secrets</p>
          </div>
          <div className="flex-1 flex justify-end">
            <BackgroundSelector
              backgrounds={BACKGROUND_THEMES}
              currentBackground={background}
              onSelect={setBackground}
            />
          </div>
        </header>
        <ChatWindow messages={messages} isLoading={isLoading} />
        <InputBar 
          userInput={userInput}
          setUserInput={setUserInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
        />
      </main>
    </div>
  );
};

export default App;
