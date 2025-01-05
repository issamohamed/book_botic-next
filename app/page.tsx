import SearchBar from './components/SearchBar'
import BookOfTheDay from './components/BookOfTheDay'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className={`${playfair.className} text-7xl font-bold text-white mb-12`}>Book Botica</h1>
      <div className="w-full max-w-2xl">
        <div className="glass-morphism rounded-lg p-6 mb-8">
          <SearchBar />
        </div>
        <div className="glass-morphism rounded-lg">
          <BookOfTheDay />
        </div>
      </div>
    </main>
  )
}