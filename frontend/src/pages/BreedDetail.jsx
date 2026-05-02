import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getBreedImages, addRecentlyViewed, getLikes } from '../lib/api';
import ImageCard from '../components/ImageCard';
import ImageModal from '../components/ImageModal';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 12;

const BreedDetail = () => {
  const { breed } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [images, setImages] = useState([]);
  const [likedImageUrls, setLikedImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const observer = useRef();

  useEffect(() => {
    const init = async () => {
      try {
        addRecentlyViewed(breed);
        const [imgs, likes] = await Promise.all([
          getBreedImages(breed),
          getLikes()
        ]);
        setImages(imgs);
        setLikedImageUrls(likes.map(l => l.image_url));
        
        const imgParam = searchParams.get('img');
        if (imgParam && imgs.includes(imgParam)) {
          setSelectedImage(imgParam);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [breed, searchParams]);

  const displayedImages = images.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = displayedImages.length < images.length;

  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleOpenModal = useCallback((img) => {
    setSelectedImage(img);
    setSearchParams({ img: encodeURIComponent(img) });
  }, [setSearchParams]);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
    setSearchParams({});
  }, [setSearchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatName = (str) => {
    return str.split('-').reverse().map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 pt-4">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 dark:text-pink-400 hover:opacity-80 transition-opacity mb-4 bg-pink-50 dark:bg-pink-900/20 px-4 py-1.5 rounded-full">
            <ArrowLeft size={16} /> Back to Gallery
          </Link>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white capitalize tracking-tight drop-shadow-sm">
            {formatName(breed)}
          </h1>
        </div>
        <span className="inline-flex items-center text-sm font-medium text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/30 px-5 py-2.5 rounded-full shadow-sm">
          {images.length} stunning photos
        </span>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 lg:gap-8 space-y-6 lg:space-y-8">
        {displayedImages.map((img, index) => {
          if (displayedImages.length === index + 1) {
            return (
              <div ref={lastElementRef} key={img} className="break-inside-avoid">
                <ImageCard 
                  imageUrl={img} 
                  breed={breed}
                  isLikedInitial={likedImageUrls.includes(img)}
                  onClick={() => handleOpenModal(img)}
                />
              </div>
            );
          } else {
            return (
              <div key={img} className="break-inside-avoid">
                <ImageCard 
                  imageUrl={img} 
                  breed={breed}
                  isLikedInitial={likedImageUrls.includes(img)}
                  onClick={() => handleOpenModal(img)}
                />
              </div>
            );
          }
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center py-12">
           <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      )}

      {selectedImage && (
        <ImageModal 
          imageUrl={selectedImage}
          breed={breed}
          onClose={handleCloseModal}
          isLikedInitial={likedImageUrls.includes(selectedImage)}
          onLikeToggle={(newStatus) => {
            if (newStatus) setLikedImageUrls([...likedImageUrls, selectedImage]);
            else setLikedImageUrls(likedImageUrls.filter(u => u !== selectedImage));
          }}
        />
      )}
    </div>
  );
};

export default BreedDetail;
