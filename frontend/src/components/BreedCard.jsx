import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRandomImageForBreed } from '../lib/api';

const BreedCard = ({ breed }) => {
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);

  const formatName = (str) => {
    return str.split('-').reverse().map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  useEffect(() => {
    let mounted = true;
    const fetchImage = async () => {
      try {
        const img = await getRandomImageForBreed(breed);
        if (mounted) {
          setImage(img);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }
    };
    fetchImage();
    return () => mounted = false;
  }, [breed]);

  return (
    <Link to={`/breed/${breed}`} className="group block h-full">
      <div className="bg-gradient-to-br from-slate-900/80 to-indigo-950/80 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 transform hover:-translate-y-2 border border-white/10 hover:border-pink-500/40 h-full flex flex-col">
        <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900 relative p-2">
          <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-inner">
            {loading ? (
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse bg-[length:200%_100%]"></div>
            ) : (
              <>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                <img 
                  src={image || 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=600&auto=format&fit=crop'} 
                  alt={formatName(breed)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </>
            )}
          </div>
        </div>
        <div className="p-5 flex-1 flex items-center justify-between bg-gradient-to-r from-pink-900/20 to-violet-900/20 border-t border-white/5">
          <h3 className="text-xl font-bold text-white capitalize truncate pr-2 group-hover:text-pink-400 transition-colors drop-shadow-sm">
            {formatName(breed)}
          </h3>
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-pink-400 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-violet-500 group-hover:text-white transition-all shadow-md group-hover:shadow-pink-500/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BreedCard;
