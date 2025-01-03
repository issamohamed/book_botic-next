'use client';

import Groq from "groq-sdk";

// Initialize the client only when the API key is available
let groq: Groq | null = null;
if (typeof window !== 'undefined') {  // Only run on client side
    groq = new Groq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || ''
    });
}

export interface BookRecommendation {
    title: string;
    author: string;
    description: string;
    coverUrl?: string;
}

const searchExa = async (query: string, options = {}) => {
    if (!process.env.NEXT_PUBLIC_EXA_API_KEY) {
        throw new Error('EXA API key is missing');
    }

    const response = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: {
            'x-api-key': process.env.NEXT_PUBLIC_EXA_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query,
            useAutoprompt: true,
            type: "auto",
            numResults: 5,
            ...options
        })
    });

    if (!response.ok) {
        throw new Error(`Exa API error: ${response.status}`);
    }

    return response.json();
};

export const getBookRecommendations = async (plotDescription: string): Promise<BookRecommendation[]> => {
    if (!groq) {
        throw new Error('Groq client is not initialized');
    }

    const prompt = `Based on the following plot description, recommend 5 books with similar themes or plot elements: 
        "${plotDescription}"
        For each book, provide the title, author, and a short, concise plot description. Format as JSON array.`;

    const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1024
    });

    return JSON.parse(completion.choices[0]?.message?.content || '[]');
};

export const getRandomPlotPrompt = async (): Promise<string> => {
    if (!groq) {
        throw new Error('Groq client is not initialized');
    }

    const prompt = "Generate a creative, safe, and engaging plot description for a potential book. Keep it between 20-50 words.";
    
    const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.9,
        max_tokens: 100
    });

    return completion.choices[0]?.message?.content?.trim() || '';
};

export const getBookOfTheDay = async (): Promise<BookRecommendation> => {
    if (!groq) {
        throw new Error('Groq client is not initialized');
    }

    try {
        // Get top news stories from Exa
        const newsResponse = await searchExa("major world news events this week", {
            category: "news",
            numResults: 5,
            contents: {
                highlights: {
                    numSentences: 2,
                    highlightsPerUrl: 1
                }
            }
        });

        // Summarize news stories for Groq
        const newsSummary = newsResponse.results
            .map((result: any) => result.highlights?.[0]?.text || '')
            .join(" ");

        // Get book recommendation based on news
        const prompt = `Based on these current events and themes: "${newsSummary}", 
            recommend one book that reflects or relates to these themes. 
            Provide the title, author, and a brief description. Format as JSON.`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 512
        });

        const bookData = JSON.parse(completion.choices[0]?.message?.content || '{}');

        // Search for book cover image
        const coverResponse = await searchExa(`${bookData.title} ${bookData.author} book cover`, {
            type: "image",
            numResults: 1,
            contents: {
                imageLinks: 1
            }
        });

        if (coverResponse.results?.[0]?.imageLinks?.[0]) {
            bookData.coverUrl = coverResponse.results[0].imageLinks[0];
        }

        return bookData;
    } catch (error) {
        console.error('Error in getBookOfTheDay:', error);
        return {
            title: "Default Book",
            author: "Unknown Author",
            description: "Unable to fetch book recommendation at this time.",
            coverUrl: "/api/placeholder/200/300"
        };
    }
};

// Speech-to-text conversion using browser's Web Speech API
export const startSpeechRecognition = (
    onResult: (transcript: string) => void,
    onError: (error: any) => void
) => {
    if (!('webkitSpeechRecognition' in window)) {
        onError('Speech recognition not supported');
        return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
    };

    recognition.onerror = onError;
    recognition.start();

    return recognition;
};