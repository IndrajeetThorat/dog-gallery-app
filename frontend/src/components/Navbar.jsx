import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dog, Heart, Moon, Sun } from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  
  return (
    <header className="sticky top-4 z-50 px-4 w-full max-w-5xl mx-auto mt-4 mb-8">
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg dark:shadow-none border border-slate-200/50 dark:border-slate-800/50 rounded-full px-6 py-3 flex justify-between items-center transition-all">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div className="bg-gradient-to-br from-pink-500 to-violet-600 p-2 rounded-full text-white shadow-md group-hover:shadow-lg transition-all group-hover:-translate-y-0.5">
            <Dog size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white hidden sm:block">Dog Gallery</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            to="/likes" 
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              location.pathname === '/likes' 
                ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-pink-600 dark:hover:text-pink-400'
            }`}
          >
            <Heart size={20} className={location.pathname === '/likes' ? 'fill-current' : ''} />
            <span className="font-semibold hidden sm:inline">Likes</span>
          </Link>
          
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
          
          <button 
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
