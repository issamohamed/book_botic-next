import { NextResponse } from 'next/server';
import type { NewsAPIResponse, NewsArticle } from '@/types';

export async function GET() {
    try {
        console.log('Fetching news headlines...');
        
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&language=en&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }

        const data: NewsAPIResponse = await response.json();
        
        if (data.status !== 'ok' || !data.articles?.length) {
            throw new Error('Invalid news response');
        }

        // Extract and combine article titles and descriptions
        const newsSummary = data.articles
            .map(article => `${article.title}. ${article.description || ''}`)
            .join(' ')
            .slice(0, 1000);

        return NextResponse.json({
            articles: data.articles,
            summary: newsSummary
        });
    } catch (error) {
        console.error('News API error:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : 'Failed to fetch news' 
        }, { status: 500 });
    }
}