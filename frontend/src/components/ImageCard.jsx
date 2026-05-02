import React, { useState } from 'react';
import { Heart, Share2 } from 'lucide-react';
import { toggleLike } from '../lib/api';
import { useToast } from '../context/ToastContext';

const ImageCard = ({ imageUrl, breed, isLikedInitial = false, onClick }) => {
  const [isLiked, setIsLiked] = useState(isLikedInitial);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToast } = useToast();

  const handleLike = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await toggleLike(imageUrl, breed, isLiked);
      setIsLiked(!isLiked);
      if (!isLiked) {
        addToast('Saved to your likes! ❤️');
      } else {
        addToast('Removed from likes.');
      }
    } catch (err) {
      console.error("Error toggling like", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/breed/${breed}?img=${encodeURIComponent(imageUrl)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cute ${breed} Dog`,
          url: shareUrl
        });
        addToast('Thanks for sharing! 🚀');
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      addToast('Link copied to clipboard! 📋');
    }
  };

  return (
    <div className="group relative rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br from-slate-900/80 to-indigo-950/80 backdrop-blur-2xl shadow-xl hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-500 transform hover:-translate-y-1 border border-white/10 p-2" onClick={onClick}>
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/80 via-slate-700/80 to-slate-800/80 animate-pulse bg-[length:200%_100%] min-h-[250px]"></div>
        )}
        <img 
          src={imageUrl} 
          alt={breed} 
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-auto object-cover group-hover:scale-105 transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Overlay Actions */}
        <div className="absolute bottom-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <button 
            onClick={handleLike}
            disabled={loading}
            className="p-3 rounded-full bg-white/10 hover:bg-pink-500 backdrop-blur-md text-white transition-all shadow-lg hover:scale-110 active:scale-95 border border-white/20 hover:border-transparent"
          >
            <Heart size={20} className={isLiked ? "fill-white text-white" : ""} />
          </button>
          <button 
            onClick={handleShare}
            className="p-3 rounded-full bg-white/10 hover:bg-violet-500 backdrop-blur-md text-white transition-all shadow-lg hover:scale-110 active:scale-95 border border-white/20 hover:border-transparent"
          >
            <Share2 size={20} />
          </button>
        </div>
        
        {/* Persist like state visually if liked but not hovering */}
        {isLiked && (
          <div className="absolute top-4 right-4 group-hover:opacity-0 transition-opacity">
            <div className="p-2.5 rounded-full bg-pink-500/90 backdrop-blur-sm text-white shadow-lg border border-pink-400/50">
              <Heart size={16} className="fill-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
