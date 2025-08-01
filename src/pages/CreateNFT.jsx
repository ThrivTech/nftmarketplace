import React, { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

const CreateNFT = ({ user, onLogout, theme, setTheme }) => {
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <NavigationBar 
        user={user} 
        onLogout={onLogout} 
        theme={theme} 
        setTheme={setTheme} 
      />
      
      <main className="flex-1 px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-xl rounded-lg shadow-lg p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold mb-6 text-center text-slate-900 dark:text-slate-100">
            Create NFT
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                NFT Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="Enter NFT title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                Description
              </label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="Describe your NFT..."
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                Upload Image
              </label>
              <div className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer transition hover:border-blue-500 bg-slate-50 dark:bg-slate-800">
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
                    className="object-contain max-h-32 p-4"
                  />
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    Click or drag an image file to upload
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              Create NFT
            </button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateNFT;