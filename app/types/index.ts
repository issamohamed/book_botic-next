export interface BookRecommendation {
    title: string;
    author: string;
    description: string;
    coverUrl?: string;
}

export type SpeechRecognitionHandler = (transcript: string) => void;
export type SpeechErrorHandler = (error: string | Error) => void;

export interface NewsArticle {
    title: string;
    description: string;
    urlToImage?: string;
    url: string;
    publishedAt: string;
    source: {
        id: string | null;
        name: string;
    };
}