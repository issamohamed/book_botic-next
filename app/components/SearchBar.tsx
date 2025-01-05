'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Sparkles } from 'lucide-react';
import { getRandomPlotPrompt, startSpeechRecognition, getBookRecommendations } from '../services/api';
import type { BookRecommendation } from '../types';

interface Props {
  showResults?: boolean;
  initialQuery?: string;
}

export default function SearchBar({ showResults = false, initialQuery = '' }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);

  // Perform initial search if query is provided
  useEffect(() => {
    if (showResults && initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, showResults]);

  const handleSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      setError('');
      setRecommendations([]);
      console.log('Searching for:', searchQuery);
      
      const results = await getBookRecommendations(searchQuery);
      console.log('Search results:', results);
      setRecommendations(results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to get recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomPrompt = async () => {
    try {
      setLoading(true);
      setError('');
      const prompt = await getRandomPlotPrompt();
      setQuery(prompt);
      if (showResults) {
        await handleSearch(prompt);
      }
    } catch (err) {
      console.error('Random prompt error:', err);
      setError('Failed to generate random prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (!showResults) {
      // On home page, navigate to search page
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      // On search page, perform search
      await handleSearch(query);
    }
  };

  const handleMicClick = () => {
    if (isListening) return;
    setIsListening(true);
    setError('');

    startSpeechRecognition(
      (transcript) => {
        setQuery(transcript);
        setIsListening(false);
        if (showResults) {
          handleSearch(transcript);
        }
      },
      (error) => {
        setError(typeof error === 'string' ? error : error.message);
        setIsListening(false);
      }
    );
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex items-center bg-maroon-800 rounded-lg border border-maroon-700 shadow-lg overflow-hidden">
          <button
            type="button"
            onClick={handleMicClick}
            className={`flex-shrink-0 px-4 py-3 ${isListening ? 'text-maroon-100' : 'text-maroon-300'} hover:text-maroon-100 transition-colors`}
            disabled={loading}
          >
            <Mic className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a plot or genre for book recommendations..."
            className="flex-grow px-4 py-3 bg-transparent text-maroon-100 placeholder-maroon-400 focus:outline-none"
            disabled={loading}
          />
          
          <button
            type="button"
            onClick={handleRandomPrompt}
            className="flex-shrink-0 px-4 py-3 text-maroon-300 hover:text-maroon-100 transition-colors"
            disabled={loading}
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="text-center text-sm text-maroon-300">
        {loading ? 'Processing...' : 'Powered by Groq'}
      </div>

      {showResults && recommendations.length > 0 && (
        <div className="mt-8 space-y-6">
          {recommendations.map((book, index) => (
            <div 
              key={index}
              className="p-6 bg-maroon-800 rounded-lg border border-maroon-700 shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-white mb-2">{book.title}</h3>
              <p className="text-maroon-300 mb-2">by {book.author}</p>
              <p className="text-maroon-100">{book.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}