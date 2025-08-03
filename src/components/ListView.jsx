import React from 'react';
import { Heart, Eye, ShoppingCart } from 'lucide-react';

const ListView = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No NFTs Available</h3>
          <p className="text-slate-600 dark:text-slate-400">Check back later for new collections!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Discover NFTs</h2>
          <p className="text-slate-600 dark:text-slate-400">Explore unique digital collectibles from talented creators</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              {/* NFT Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Hover Actions */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-slate-900 transition-colors">
                    <Heart className="w-4 h-4 text-slate-900 dark:text-slate-100" />
                  </button>
                  <button className="p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-slate-900 transition-colors">
                    <Eye className="w-4 h-4 text-slate-900 dark:text-slate-100" />
                  </button>
                </div>
              </div>

              {/* NFT Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1 truncate">
                  {item.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {/* {item.owner.charAt(0).toUpperCase()} */}
                      </span>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {item.owner}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Price</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {item.price} ETH
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListView;
