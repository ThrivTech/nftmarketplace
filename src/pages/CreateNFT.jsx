// src/pages/CreateNFT.jsx
import React, { useState, useEffect } from "react";

const CreateNFT = ({ theme }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreview(null);
  }, [image]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, description, image });
  };

  return (
    <section
      className={`min-h-screen px-4 py-12 flex items-center justify-center ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-xl rounded-lg shadow-md p-8 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Create NFT</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">NFT Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
              placeholder="Enter NFT title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Description
            </label>
            <textarea
              rows={15}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition focus:ring-2 focus:ring-blue-500 resize-none ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
              placeholder="Describe your NFT..."
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Upload Image
            </label>
            <div
              className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition ${
                theme === "dark"
                  ? "border-gray-600 hover:border-blue-400 bg-gray-700"
                  : "border-gray-300 hover:border-blue-500 bg-gray-50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
              {preview ? (
                <img
                  src={preview}
                  alt="NFT preview"
                  className="object-contain max-h-24 p-4"
                />
              ) : (
                <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  Click or drag an image file to upload
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
          >
            Submit NFT
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateNFT;
