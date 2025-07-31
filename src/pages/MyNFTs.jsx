import React, { useState } from 'react';
import { dummyNFTs } from '../data/dummyNFTs';

const MyNFTs = ({ isDark }) => {
  const [nfts, setNfts] = useState(dummyNFTs);

  const toggleAvailability = (id) => {
    setNfts((prev) =>
      prev.map((nft) =>
        nft.id === id ? { ...nft, available: !nft.available } : nft
      )
    );
  };

  return (
    <section className={`min-h-screen px-6 py-10 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">My NFTs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className={`rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold">{nft.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">
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
                      className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm">For Sale</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyNFTs;
