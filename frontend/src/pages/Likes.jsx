import React, { useState, useEffect } from 'react';
import { getLikes } from '../lib/api';
import ImageCard from '../components/ImageCard';
import ImageModal from '../components/ImageModal';
import { Heart } from 'lucide-react';

const Likes = () => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const data = await getLikes();
        setLikes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLikes();
  }, []);

  const handleOpenModal = (like) => {
    setSelectedImage(like);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleLikeToggle = (newStatus, imageUrl) => {
    if (!newStatus) {
      setLikes(likes.filter(l => l.image_url !== imageUrl));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 pt-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-full text-pink-500">
             <Heart size={32} className="fill-current" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">
            Liked Images
          </h1>
        </div>
        <span className="inline-flex items-center text-sm font-medium text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/30 px-5 py-2.5 rounded-full shadow-sm">
          {likes.length} saved
        </span>
      </div>

      {likes.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-sm">
          <Heart size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No likes yet</h3>
          <p className="text-slate-500 dark:text-slate-400">You haven't liked any images yet. Go browse some breeds and tap the heart icon!</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 lg:gap-8 space-y-6 lg:space-y-8">
          {likes.map(like => (
            <div key={like.id} className="break-inside-avoid">
              <ImageCard 
                imageUrl={like.image_url} 
                breed={like.breed}
                isLikedInitial={true}
                onClick={() => handleOpenModal(like)}
              />
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <ImageModal 
          imageUrl={selectedImage.image_url}
          breed={selectedImage.breed}
          onClose={handleCloseModal}
          isLikedInitial={true}
          onLikeToggle={(status) => handleLikeToggle(status, selectedImage.image_url)}
        />
      )}
    </div>
  );
};

export default Likes;
