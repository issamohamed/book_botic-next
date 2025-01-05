'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { getBookOfTheDay } from '../services/api';
import type { BookRecommendation } from '../types';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function BookOfTheDay() {
  const [book, setBook] = useState<BookRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true);
        setError('');
        console.log('Fetching book of the day...');
        const bookData = await getBookOfTheDay();
        console.log('Received book data:', bookData);
        setBook(bookData);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Unable to fetch book recommendation at this time.');
        setBook({
          title: "Book Not Available",
          author: "Try Again Later",
          description: "We're currently unable to fetch today's book recommendation. Please check back later."
        });
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, []);

  if (loading) {
    return (
      <div className="mt-12 p-6 bg-maroon-800 rounded-lg border border-maroon-700 shadow-lg animate-pulse">
        <h2 className={`${playfair.className} text-2xl font-bold text-white mb-4`}>Book of the Day</h2>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-shrink-0 w-[200px] h-[300px] bg-maroon-700 rounded-lg" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-maroon-700 rounded w-3/4" />
            <div className="h-4 bg-maroon-700 rounded w-1/2" />
            <div className="h-20 bg-maroon-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="mt-12 p-6 bg-maroon-800 rounded-lg border border-maroon-700 shadow-lg">
      <h2 className={`${playfair.className} text-2xl font-bold text-white mb-4`}>Book of the Day</h2>
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="relative flex-shrink-0 w-[200px] h-[300px] bg-maroon-700 rounded-lg overflow-hidden">
          <Image
            src="/red_book.jpg"
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover rounded-lg"
            sizes="200px"
            priority
          />
        </div>
        <div className="flex-grow">
          <h3 className={`${playfair.className} text-xl font-semibold text-white`}>{book.title}</h3>
          <p className="text-maroon-300 mb-2">by {book.author}</p>
          <p className="text-maroon-100">{book.description}</p>
          {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}