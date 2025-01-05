'use client';

import { useSearchParams } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';

const playfair = Playfair_Display({ subsets: ['latin'] })

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-8">
      <div className="w-full max-w-3xl relative">
        <Link 
          href="/"
          className="absolute -left-16 top-2 text-maroon-100 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        
        <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold text-white mb-12 text-center`}>
          Book Botica
        </h1>
        
        <div className="glass-morphism rounded-lg p-6">
          <SearchBar initialQuery={query || ''} showResults={true} />
        </div>
      </div>
    </main>
  );
}