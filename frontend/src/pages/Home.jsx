import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { getBreeds, getRecentlyViewed, getMostLiked } from '../lib/api';
import BreedCard from '../components/BreedCard';
import { Search, Sparkles } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

const Home = () => {
  const [breeds, setBreeds] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [mostLiked, setMostLiked] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, liked, viewed
  const [sort, setSort] = useState('asc'); // asc, desc, most-liked
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const observer = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [breedsData, viewedData, likedData] = await Promise.all([
          getBreeds(),
          getRecentlyViewed(),
          getMostLiked()
        ]);
        
        let breedList = [];
        for (const [breed, subBreeds] of Object.entries(breedsData)) {
          if (subBreeds.length > 0) {
            subBreeds.forEach(sub => breedList.push(`${breed}-${sub}`));
          } else {
            breedList.push(breed);
          }
        }
        setBreeds(breedList);
        setRecentlyViewed(viewedData.map(v => v.breed));
        setMostLiked(likedData.map(l => l.breed));
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAndSortedBreeds = useMemo(() => {
    let result = breeds;
    if (search) {
      result = result.filter(b => b.toLowerCase().includes(search.toLowerCase()));
    }
    if (filter === 'viewed') {
      result = result.filter(b => recentlyViewed.includes(b));
    } else if (filter === 'liked') {
      result = result.filter(b => mostLiked.includes(b));
    }
    if (sort === 'asc') {
      result = [...result].sort((a, b) => a.localeCompare(b));
    } else if (sort === 'desc') {
      result = [...result].sort((a, b) => b.localeCompare(a));
    } else if (sort === 'most-liked') {
      result = [...result].sort((a, b) => {
        const aIndex = mostLiked.indexOf(a);
        const bIndex = mostLiked.indexOf(b);
        const aRank = aIndex !== -1 ? aIndex : Infinity;
        const bRank = bIndex !== -1 ? bIndex : Infinity;
        return aRank - bRank;
      });
    }
    return result;
  }, [breeds, search, filter, sort, recentlyViewed, mostLiked]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, filter, sort]);

  const displayedBreeds = filteredAndSortedBreeds.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = displayedBreeds.length < filteredAndSortedBreeds.length;

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 text-white p-8 md:p-20 text-center shadow-xl">
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 dark:bg-black/10 backdrop-blur-[2px]"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium mb-4 shadow-sm border border-white/10">
            <Sparkles size={16} className="text-pink-200" /> Discover Man's Best Friend
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-sm">
            The Ultimate Dog Gallery
          </h1>
          <p className="text-lg md:text-xl text-pink-50/90 font-light max-w-2xl mx-auto">
            Explore hundreds of breeds, discover stunning photography, and save your favorites in one beautiful place.
          </p>
          <div className="pt-6 max-w-lg mx-auto relative text-slate-900 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={22} />
            <input 
              type="text" 
              placeholder="Search for a breed (e.g., Husky, Corgi)..." 
              className="w-full pl-14 pr-6 py-4 rounded-full bg-white/95 backdrop-blur-sm shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/40 transition-all text-lg placeholder-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && !search && filter === 'all' && (
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pl-2">
            Jump Back In
          </h2>
          <div className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar snap-x px-2">
            {recentlyViewed.map(breed => (
              <div key={breed} className="snap-start shrink-0 w-[280px]">
                <BreedCard breed={breed} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Controls */}
      <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-[5.5rem] z-40">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 px-2">
          Showing {displayedBreeds.length} of {filteredAndSortedBreeds.length} breeds
        </div>
        
        <div className="flex gap-4 w-full sm:w-auto">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:text-white transition-all cursor-pointer font-medium shadow-sm"
          >
            <option value="all">All Breeds</option>
            <option value="viewed">Recently Viewed</option>
            <option value="liked">Has Likes</option>
          </select>
          
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:text-white transition-all cursor-pointer font-medium shadow-sm"
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
            <option value="most-liked">Most Liked</option>
          </select>
        </div>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 px-2">
        {displayedBreeds.map((breed, index) => {
          if (displayedBreeds.length === index + 1) {
            return (
              <div ref={lastElementRef} key={breed}>
                <BreedCard breed={breed} />
              </div>
            );
          } else {
            return (
              <div key={breed}>
                <BreedCard breed={breed} />
              </div>
            );
          }
        })}
      </section>
      
      {filteredAndSortedBreeds.length === 0 && (
        <div className="text-center py-24 text-slate-500 dark:text-slate-400">
          <div className="text-6xl mb-4">🐕</div>
          <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">No breeds found</h3>
          <p>Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center py-8">
          <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Home;
