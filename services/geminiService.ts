import { GoogleGenAI, Part } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getExplanation = async (prompt: string, imagePart: Part | null): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        
        const contents = imagePart ? { parts: [{ text: prompt }, imagePart] } : prompt;

        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                systemInstruction: SYSTEM_PROMPT,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error getting explanation from Gemini:", error);
        return "I apologize, but I encountered an arcane disturbance and cannot answer at this moment.";
    }
};

export const generateSealImage = async (prompt: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return null;
    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        return null;
    }
};
