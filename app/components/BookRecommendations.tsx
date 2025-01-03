// app/components/BookRecommendations.tsx
import { BookRecommendation } from '../types';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

interface Props {
  recommendations: BookRecommendation[];
}

export default function BookRecommendations({ recommendations }: Props) {
  if (!recommendations.length) return null;

  return (
    <div className="mt-8 space-y-6">
      <h2 className={`${playfair.className} text-2xl font-bold text-white mb-6`}>
        Recommended Books
      </h2>
      {recommendations.map((book, index) => (
        <div 
          key={index} 
          className="p-6 bg-maroon-800 rounded-lg border border-maroon-700 shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <h3 className={`${playfair.className} text-xl font-semibold text-white`}>
            {book.title}
          </h3>
          <p className="text-maroon-300 mb-2">by {book.author}</p>
          <p className="text-maroon-100">{book.description}</p>
        </div>
      ))}
    </div>
  );
}