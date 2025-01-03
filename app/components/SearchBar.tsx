'use client'

import { useState } from 'react';
import { Mic, Sparkles } from 'lucide-react';
import { getRandomPlotPrompt, startSpeechRecognition, getBookRecommendations } from '../services/api';
import { Alert, AlertDescription } from './ui/alert';
import { BookRecommendation } from '../types';
import BookRecommendations from './BookRecommendations';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const results = await getBookRecommendations(query);
      setRecommendations(results);
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomPrompt = async () => {
    setLoading(true);
    try {
      const prompt = await getRandomPlotPrompt();
      setQuery(prompt);
    } catch (err) {
      setError('Failed to generate random prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMicClick = async () => {
    if (isListening) return;

    setIsListening(true);
    setError('');

    try {
      startSpeechRecognition(
        (transcript) => {
          setQuery(transcript);
          setIsListening(false);
        },
        (error) => {
          setError('Failed to recognize speech. Please try again.');
          setIsListening(false);
        }
      );
    } catch (err) {
      setError('Speech recognition is not supported in your browser.');
      setIsListening(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="relative flex items-center bg-maroon-800 rounded-lg border border-maroon-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <button
              type="button"
              onClick={handleMicClick}
              className={`flex items-center pl-4 ${isListening ? 'text-maroon-100' : 'text-maroon-300'} hover:text-maroon-100`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a plot or genre for book recommendations..."
              className="w-full p-4 bg-transparent text-white placeholder-maroon-400 focus:outline-none"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleRandomPrompt}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-maroon-300 hover:text-maroon-100"
              disabled={loading}
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <p className="text-center text-sm text-maroon-300">
        {loading ? 'Processing...' : 'Powered by Groq'}
      </p>
      {recommendations.length > 0 && (
        <BookRecommendations recommendations={recommendations} />
      )}
    </div>
  );
}