import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Camera } from "lucide-react";
import API from "../api";

const Signup = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size should be less than 5MB');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
      }));
      setPreview(URL.createObjectURL(file));
      setError(""); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for file upload
      const payload = new FormData();
      payload.append("name", formData.username);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      
      // Add profile picture if selected
      if (formData.profilePicture) {
        payload.append("profilePic", formData.profilePicture);
      }

      console.log("Sending signup data:");
      console.log("- name:", formData.username);
      console.log("- email:", formData.email);
      console.log("- profilePic:", formData.profilePicture ? "File selected" : "No file");

      // Make sure to set correct headers for multipart/form-data
      const signupResponse = await API.post("/auth/signup", payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Signup response:", signupResponse.data);

      // ✅ Auto-login after successful signup
      const loginRes = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const token = loginRes.data?.token;
      console.log("Login response:", loginRes.data);

      if (token) {
        localStorage.setItem("token", token);
        
        // Fetch user profile to get complete user data including profilePic
        const userProfileRes = await API.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("User profile response:", userProfileRes.data);

        const userData = userProfileRes.data;
        console.log("User data passed to onLogin:", userData);

        if (onLogin) onLogin(userData);
        navigate("/marketplace");
      } else {
        setError("Signup succeeded, but login failed. Please try logging in manually.");
        navigate("/");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      
      if (err.response) {
        // Server responded with error status
        const errorMessage = err.response.data?.message || err.response.data?.error || "Signup failed";
        setError(errorMessage);
        console.log("Server error response:", err.response.data);
        
        // Log specific field errors if available
        if (err.response.data?.errors) {
          console.log("Field errors:", err.response.data.errors);
        }
      } else if (err.request) {
        // Network error
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-slate-50">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Join the NFT Marketplace community
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 border border-slate-200 dark:border-slate-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profilePicture"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    id="profilePicture"
                    name="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                Click the camera icon to upload a profile picture (max 5MB)
              </p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;