'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { getBookOfTheDay } from '../services/api';
import { Alert, AlertDescription } from './ui/alert';
import type { BookRecommendation } from '../types';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function BookOfTheDay() {
  const [book, setBook] = useState<BookRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await getBookOfTheDay();
        setBook(bookData);
      } catch (err) {
        setError('Failed to fetch book of the day. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, []);

  if (loading) {
    return (
      <div className="mt-12 p-6 bg-maroon-800 rounded-lg border border-maroon-700 shadow-lg">
        <h2 className={`${playfair.className} text-2xl font-bold text-white mb-4`}>Book of the Day</h2>
        <div className="animate-pulse flex flex-col md:flex-row items-center">
          <div className="w-48 h-72 bg-maroon-700 rounded-lg mb-4 md:mb-0 md:mr-6" />
          <div className="flex-1">
            <div className="h-6 bg-maroon-700 rounded w-3/4 mb-2" />
            <div className="h-4 bg-maroon-700 rounded w-1/2 mb-4" />
            <div className="h-20 bg-maroon-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!book) return null;

  return (
    <div className="mt-12 p-6 bg-maroon-800 rounded-lg border border-maroon-700 shadow-lg">
      <h2 className={`${playfair.className} text-2xl font-bold text-white mb-4`}>Book of the Day</h2>
      <div className="flex flex-col md:flex-row items-center">
        <Image
          src={book.coverUrl || "/api/placeholder/200/300"}
          alt={`Cover of ${book.title}`}
          width={200}
          height={300}
          className="rounded-lg shadow-lg mb-4 md:mb-0 md:mr-6"
        />
        <div>
          <h3 className={`${playfair.className} text-xl font-semibold text-white`}>{book.title}</h3>
          <p className="text-maroon-300 mb-2">by {book.author}</p>
          <p className="text-maroon-100">{book.description}</p>
        </div>
      </div>
    </div>
  );
}