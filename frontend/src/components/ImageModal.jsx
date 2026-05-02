import React from 'react';
import { X, Heart, Share2 } from 'lucide-react';
import { toggleLike } from '../lib/api';
import { useToast } from '../context/ToastContext';

const ImageModal = ({ imageUrl, breed, onClose, isLikedInitial, onLikeToggle }) => {
  const [isLiked, setIsLiked] = React.useState(isLikedInitial);
  const [loading, setLoading] = React.useState(false);
  const { addToast } = useToast();

  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleLike = async () => {
    setLoading(true);
    try {
      await toggleLike(imageUrl, breed, isLiked);
      setIsLiked(!isLiked);
      if (onLikeToggle) onLikeToggle(!isLiked);
      if (!isLiked) {
        addToast('Saved to your likes! ❤️');
      } else {
        addToast('Removed from likes.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/breed/${breed}?img=${encodeURIComponent(imageUrl)}`;
    if (navigator.share) {
      try {
        await navigator.share({ url: shareUrl });
        addToast('Thanks for sharing! 🚀');
      } catch (err) {
        // ignore error (like user cancelling share)
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      addToast('Link copied! 📋');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors">
          <X size={32} />
        </button>
        
        <img src={imageUrl} alt={breed} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
        
        <div className="mt-4 flex gap-4">
          <button 
            onClick={handleLike}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors font-medium"
          >
            <Heart size={20} className={isLiked ? "fill-red-500 text-red-500" : ""} />
            {isLiked ? 'Liked' : 'Like'}
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors font-medium"
          >
            <Share2 size={20} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
