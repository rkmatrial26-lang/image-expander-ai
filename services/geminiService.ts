import { GoogleGenAI, Modality } from "@google/genai";
import { MODEL_NAME } from '../constants';

const generateSingleImage = async (base64ImageDataUrl: string, prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const base64Data = base64ImageDataUrl.split(',')[1];
    if (!base64Data) {
        throw new Error('Invalid base64 image data URL.');
    }

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: 'image/png',
                    },
                },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
        return imagePart.inlineData.data;
    } else {
        const textResponse = response.text?.trim();
        if (textResponse) {
          throw new Error(`API returned a text response instead of an image: "${textResponse}"`);
        }
        throw new Error('No image data found in the API response.');
    }
};


export const generateMultipleExpandedImages = async (base64ImageDataUrl: string, prompt: string): Promise<string[]> => {
    try {
        const promises = [
            generateSingleImage(base64ImageDataUrl, prompt),
            generateSingleImage(base64ImageDataUrl, prompt),
            generateSingleImage(base64ImageDataUrl, prompt)
        ];

        const results = await Promise.allSettled(promises);

        const successfulResults = results
            .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
            .map(result => result.value);

        if (successfulResults.length === 0) {
            const firstErrorReason = results.find(r => r.status === 'rejected') as PromiseRejectedResult | undefined;
            const errorMessage = firstErrorReason?.reason instanceof Error ? firstErrorReason.reason.message : "All generation requests failed.";
            console.error("All Gemini API calls failed.", results);
            throw new Error(errorMessage);
        }

        return successfulResults;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error(`Gemini API Error: ${error instanceof Error ? error.message : String(error)}`);
    }
};