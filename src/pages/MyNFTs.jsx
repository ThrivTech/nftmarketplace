import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import { dummyNFTs } from '../data/dummyNFTs'; // Update import path as needed

const MyNFTs = ({ user, onLogout, theme, setTheme }) => {
  const [nfts, setNfts] = useState(dummyNFTs);

  const toggleAvailability = (id) => {
    setNfts((prev) =>
      prev.map((nft) =>
        nft.id === id ? { ...nft, available: !nft.available } : nft
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <NavigationBar 
        user={user} 
        onLogout={onLogout} 
        theme={theme} 
        setTheme={setTheme} 
      />
      
      <main className="flex-1 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-slate-900 dark:text-slate-100">
            My NFTs
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                className="rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {nft.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {nft.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm">
                      {nft.available ? (
                        <span className="text-green-500 font-medium">Available</span>
                      ) : (
                        <span className="text-red-500 font-medium">Not for Sale</span>
                      )}
                    </span>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={nft.available}
                        onChange={() => toggleAvailability(nft.id)}
                        className="w-5 h-5 text-blue-600 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-slate-900 dark:text-slate-100">
                        For Sale
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyNFTs;