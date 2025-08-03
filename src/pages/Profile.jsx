import React, { useState, useEffect } from 'react';
import { User, Camera, Save, X } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import API from '../api';

const Profile = ({ user, onLogout, theme, setTheme, onUserUpdate }) => {
  // Debug: Log current user data
  console.log('Current user data in Profile:', user);
  
  // Helper function to construct profile picture URL
  const getProfilePictureUrl = (profilePicture) => {
    if (!profilePicture) return null;
    const url = profilePicture.startsWith('http') 
      ? profilePicture 
      : `https://nftbackend-qz6p.onrender.com/${profilePicture}`;
    console.log('Constructed profile picture URL:', url);
    return url;
  };

  const [formData, setFormData] = useState({
    name: user?.username || '',
    profilePic: null
  });
  const [preview, setPreview] = useState(() => getProfilePictureUrl(user?.profilePicture));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (formData.profilePic) {
      const objectUrl = URL.createObjectURL(formData.profilePic);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [formData.profilePic]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file' });
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        return;
      }
      setFormData(prev => ({
        ...prev,
        profilePic: file
      }));
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const submitData = new FormData();
      submitData.append('name', formData.name);
      if (formData.profilePic) {
        submitData.append('profilePic', formData.profilePic);
      }

      const response = await fetch('https://nftbackend-qz6p.onrender.com/api/user/updateprofile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const data = await response.json();
      console.log('Profile update response:', data); // Debug log

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Construct proper profile picture URL using helper function
        const profilePictureUrl = getProfilePictureUrl(data.user?.profilePicture) || getProfilePictureUrl(user.profilePicture);
        
        // Update user data in parent component
        const updatedUser = {
          ...user,
          username: formData.name,
          name: formData.name, // Also update name field
          profilePicture: profilePictureUrl
        };
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Call parent update function if provided
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }
        
        // Update preview to show new image
        setPreview(profilePictureUrl);
        
        // Reset form
        setFormData(prev => ({ ...prev, profilePic: null }));
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profilePic: null }));
    // Reset to original user profile picture using helper function
    setPreview(getProfilePictureUrl(user?.profilePicture));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <NavigationBar 
        user={user} 
        onLogout={onLogout} 
        theme={theme} 
        setTheme={setTheme} 
      />
      
      <main className="flex-1 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Update Profile
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Update your username and profile picture
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                      </div>
                    )}
                  </div>
                  
                  {formData.profilePic && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Camera className="w-4 h-4" />
                    <span>Choose Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    JPG, PNG or GIF (max 5MB)
                  </p>
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="Enter your username"
                />
              </div>

              {/* Message Display */}
              {message.text && (
                <div className={`p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !formData.name.trim()}
                  className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Update Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
