'use client';

import type { BookRecommendation } from '@/types';

export async function getRandomPlotPrompt(): Promise<string> {
    const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: [{
                role: "user",
                content: "List a random genre with an adjective following the genre's name."
            }],
            temperature: 0.9,
            max_tokens: 100,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to generate prompt');
    }

    const data = await response.json();
    return data.result?.trim() || '';
}

export async function getBookRecommendations(plotDescription: string): Promise<BookRecommendation[]> {
    const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: [{
                role: "user",
                content: `Based on the following plot description, recommend 5 books with similar themes or plot elements: "${plotDescription}". Return the response as a JSON array with each book having a title, author, and description field. Format example: [{"title": "Book Title", "author": "Author Name", "description": "Book description"}]`
            }],
            temperature: 0.7,
            max_tokens: 1024,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to get recommendations');
    }

    try {
        const data = await response.json();
        console.log('Raw Groq response:', data);
        
        if (!data.result) {
            throw new Error('No result in response');
        }

        const recommendations = JSON.parse(data.result);
        console.log('Parsed recommendations:', recommendations);

        if (!Array.isArray(recommendations)) {
            throw new Error('Response is not an array');
        }

        return recommendations;
    } catch (error) {
        console.error('Error parsing recommendations:', error);
        throw new Error('Failed to parse book recommendations');
    }
}

export async function getBookOfTheDay(): Promise<BookRecommendation> {
    try {
        // Get current news
        console.log('Fetching news...');
        const newsResponse = await fetch('/api/news');
        if (!newsResponse.ok) {
            throw new Error('Failed to fetch news');
        }

        const newsData = await newsResponse.json();
        console.log('News data received:', newsData);
        
        if (!newsData.summary) {
            throw new Error('No news content found');
        }

        // Get book recommendation based on news
        console.log('Getting book recommendation...');
        const bookResponse = await fetch('/api/groq', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [{
                    role: "user",
                    content: `Based on these current events: "${newsData.summary}", recommend one book that reflects similar themes or topics. Return response in this JSON format: {"title": "Book Title", "author": "Author Name", "description": "Brief description of the book and how it relates to current events"}`
                }],
                temperature: 0.7,
                max_tokens: 512,
            }),
        });

        if (!bookResponse.ok) {
            throw new Error('Failed to get book recommendation');
        }

        const bookData = await bookResponse.json();
        console.log('Book recommendation received:', bookData);
        const recommendation = JSON.parse(bookData.result);

        // Try to get a news article image
        const articleWithImage = newsData.articles?.find((article: any) => article.urlToImage);
        if (articleWithImage?.urlToImage) {
            recommendation.coverUrl = articleWithImage.urlToImage;
        }

        return recommendation;
    } catch (error) {
        console.error('Error in getBookOfTheDay:', error);
        throw error;
    }
}

export function startSpeechRecognition(
    onResult: (transcript: string) => void,
    onError: (error: string | Error) => void
): void {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) {
        onError('Speech recognition not supported in this browser');
        return;
    }

    try {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
        };

        recognition.onerror = (event: any) => {
            onError(event.error || 'Speech recognition failed');
        };

        recognition.start();
    } catch (err) {
        onError(err instanceof Error ? err : new Error('Speech recognition failed'));
    }
}