# Backend Integration Guide - NFT Marketplace Project

## Table of Contents
1. [Overview](#overview)
2. [API Architecture](#api-architecture)
3. [Authentication System](#authentication-system)
4. [API Endpoints Integration](#api-endpoints-integration)
5. [Error Handling](#error-handling)
6. [File Upload Implementation](#file-upload-implementation)
7. [State Management with Backend](#state-management-with-backend)
8. [Security Considerations](#security-considerations)
9. [Adding New API Features](#adding-new-api-features)
10. [Testing and Debugging](#testing-and-debugging)

## Overview

### Frontend-Backend Communication Flow
```
Frontend (React) ←→ HTTP Requests ←→ Backend API (Node.js/Express)
     ↓                                        ↓
Local Storage                            Database (MongoDB)
(Token, User Data)                       (Users, NFTs, etc.)
```

### Key Integration Points
1. **Authentication**: Login/Signup with JWT tokens
2. **User Management**: Profile updates, user data
3. **File Uploads**: Profile pictures, NFT images
4. **Data Fetching**: NFTs, user information
5. **State Synchronization**: Frontend state ↔ Backend data

## API Architecture

### Base Configuration (src/api.js)
```javascript
// API base configuration
const API_BASE_URL = 'https://nftbackend-qz6p.onrender.com';

const API = {
  // Auth endpoints
  login: `${API_BASE_URL}/api/auth/login`,
  signup: `${API_BASE_URL}/api/auth/signup`,
  
  // User endpoints
  profile: `${API_BASE_URL}/api/user/me`,
  updateProfile: `${API_BASE_URL}/api/user/updateprofile`,
  
  // File endpoints
  uploads: `${API_BASE_URL}/uploads/`,
};

export default API;
```

### HTTP Methods Used
- **GET**: Retrieve data (user profile, NFTs)
- **POST**: Create/Update data (login, signup, profile update)
- **PUT**: Update existing data
- **DELETE**: Remove data

### Request/Response Format
```javascript
// Request format
{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify(data)
}

// Response format
{
  success: true/false,
  message: "Success/Error message",
  data: { /* response data */ },
  user: { /* user data */ }
}
```

## Authentication System

### JWT Token Flow
```
1. User Login → Backend validates → Returns JWT token
2. Frontend stores token → localStorage.setItem('token', token)
3. Subsequent requests → Include token in Authorization header
4. Backend validates token → Processes request
```

### Implementation

#### 1. Login Process (pages/login.jsx)
```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await fetch('https://nftbackend-qz6p.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update app state
      onLogin(data.user);
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

#### 2. Token Storage and Retrieval
```javascript
// Store token
localStorage.setItem('token', token);

// Retrieve token
const token = localStorage.getItem('token');

// Remove token (logout)
localStorage.removeItem('token');
localStorage.removeItem('user');
```

#### 3. Authenticated Requests
```javascript
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  };
  
  const response = await fetch(url, config);
  
  // Handle token expiration
  if (response.status === 401) {
    // Token expired, redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
    return;
  }
  
  return response;
};
```

#### 4. Session Restoration (App.jsx)
```javascript
useEffect(() => {
  const restoreSession = async () => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser);
        
        // Optionally verify token with backend
        const response = await fetch('/api/user/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          setUser(parsedUser);
        } else {
          // Invalid token, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Session restoration failed:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  };
  
  restoreSession();
}, []);
```

## API Endpoints Integration

### 1. User Signup
```javascript
// Frontend implementation
const handleSignup = async (formData) => {
  const submitData = new FormData();
  submitData.append('name', formData.name);
  submitData.append('email', formData.email);
  submitData.append('password', formData.password);
  if (formData.profilePic) {
    submitData.append('profilePic', formData.profilePic);
  }

  const response = await fetch('https://nftbackend-qz6p.onrender.com/api/auth/signup', {
    method: 'POST',
    body: submitData, // Note: No Content-Type header for FormData
  });

  const data = await response.json();
  return data;
};

// Backend endpoint (reference)
// POST /api/auth/signup
// Body: FormData with name, email, password, profilePic (file)
// Response: { success, message, user, token }
```

### 2. User Login
```javascript
// Frontend implementation
const handleLogin = async (email, password) => {
  const response = await fetch('https://nftbackend-qz6p.onrender.com/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data;
};

// Backend endpoint (reference)
// POST /api/auth/login
// Body: { email, password }
// Response: { success, message, user, token }
```

### 3. Get User Profile
```javascript
// Frontend implementation
const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('https://nftbackend-qz6p.onrender.com/api/user/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

// Backend endpoint (reference)
// GET /api/user/me
// Headers: Authorization: Bearer <token>
// Response: { success, user }
```

### 4. Update User Profile
```javascript
// Frontend implementation (pages/Profile.jsx)
const updateProfile = async (formData) => {
  const token = localStorage.getItem('token');
  const submitData = new FormData();
  
  submitData.append('name', formData.name);
  if (formData.profilePic) {
    submitData.append('profilePic', formData.profilePic);
  }

  const response = await fetch('https://nftbackend-qz6p.onrender.com/api/user/updateprofile', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: submitData,
  });

  const data = await response.json();
  return data;
};

// Backend endpoint (reference)
// POST /api/user/updateprofile
// Headers: Authorization: Bearer <token>
// Body: FormData with name, profilePic (file)
// Response: { success, message, user }
```

## Error Handling

### 1. HTTP Status Code Handling
```javascript
const handleApiResponse = async (response) => {
  const data = await response.json();
  
  switch (response.status) {
    case 200:
    case 201:
      return data;
      
    case 400:
      throw new Error(data.message || 'Bad request');
      
    case 401:
      // Unauthorized - token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
      throw new Error('Session expired. Please login again.');
      
    case 403:
      throw new Error('Access forbidden');
      
    case 404:
      throw new Error('Resource not found');
      
    case 500:
      throw new Error('Server error. Please try again later.');
      
    default:
      throw new Error(data.message || 'An error occurred');
  }
};
```

### 2. Network Error Handling
```javascript
const makeApiCall = async (url, options) => {
  try {
    const response = await fetch(url, options);
    return await handleApiResponse(response);
  } catch (error) {
    if (error.name === 'TypeError') {
      // Network error
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};
```

### 3. User-Friendly Error Display
```javascript
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = async (formData) => {
  setLoading(true);
  setError('');
  
  try {
    const result = await makeApiCall('/api/endpoint', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    
    // Success handling
    console.log('Success:', result);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

// In JSX
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
    {error}
  </div>
)}
```

## File Upload Implementation

### 1. Profile Picture Upload
```javascript
// Frontend - File selection and preview
const [selectedFile, setSelectedFile] = useState(null);
const [preview, setPreview] = useState(null);

const handleFileChange = (e) => {
  const file = e.target.files[0];
  
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Cleanup function
    return () => URL.revokeObjectURL(objectUrl);
  }
};

// Upload implementation
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('profilePic', file);
  formData.append('name', userName);

  const response = await fetch('/api/user/updateprofile', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};
```

### 2. File URL Construction
```javascript
// Helper function to construct full image URLs
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Construct full URL
  return `https://nftbackend-qz6p.onrender.com/${imagePath}`;
};

// Usage
const profilePictureUrl = getImageUrl(user.profilePicture);
```

### 3. Image Display with Fallback
```javascript
const ProfileImage = ({ user, size = 'w-8 h-8' }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getImageUrl(user?.profilePicture);

  return (
    <div className={`${size} rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800`}>
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={user.username}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <User className="w-4 h-4 text-slate-400" />
        </div>
      )}
    </div>
  );
};
```

## State Management with Backend

### 1. Synchronizing Frontend State with Backend
```javascript
// App.jsx - Global state management
const [user, setUser] = useState(null);

// Update user after profile change
const handleUserUpdate = (updatedUser) => {
  // Update local state
  setUser(updatedUser);
  
  // Update localStorage
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  // Optionally sync with backend
  syncUserWithBackend(updatedUser);
};

// Profile.jsx - Local state with backend sync
const handleProfileUpdate = async (formData) => {
  try {
    // Update backend
    const response = await updateProfile(formData);
    
    if (response.success) {
      // Construct updated user object
      const updatedUser = {
        ...user,
        username: formData.name,
        profilePicture: getImageUrl(response.user.profilePicture),
      };
      
      // Update parent component state
      onUserUpdate(updatedUser);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    }
  } catch (error) {
    setMessage({ type: 'error', text: error.message });
  }
};
```

### 2. Data Fetching Patterns
```javascript
// Custom hook for API data fetching
const useApiData = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const result = await handleApiResponse(response);
        setData(result.data || result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Usage in component
const MyNFTs = () => {
  const { data: nfts, loading, error, refetch } = useApiData('/api/user/nfts');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {nfts.map(nft => (
        <NFTCard key={nft.id} nft={nft} />
      ))}
    </div>
  );
};
```

### 3. Optimistic Updates
```javascript
// Update UI immediately, then sync with backend
const handleLikeNFT = async (nftId) => {
  // Optimistic update
  setNfts(prev => prev.map(nft => 
    nft.id === nftId 
      ? { ...nft, liked: !nft.liked, likes: nft.liked ? nft.likes - 1 : nft.likes + 1 }
      : nft
  ));

  try {
    // Sync with backend
    await fetch(`/api/nfts/${nftId}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  } catch (error) {
    // Revert optimistic update on error
    setNfts(prev => prev.map(nft => 
      nft.id === nftId 
        ? { ...nft, liked: !nft.liked, likes: nft.liked ? nft.likes - 1 : nft.likes + 1 }
        : nft
    ));
    console.error('Failed to update like:', error);
  }
};
```

## Security Considerations

### 1. Token Security
```javascript
// Secure token storage (consider using httpOnly cookies for production)
const storeToken = (token) => {
  // For development - localStorage
  localStorage.setItem('token', token);
  
  // For production - consider httpOnly cookies
  // document.cookie = `token=${token}; httpOnly; secure; sameSite=strict`;
};

// Token validation
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Basic JWT structure check
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload (don't verify signature on frontend)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};
```

### 2. Input Validation
```javascript
// Client-side validation (always validate on backend too)
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validateFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please select a JPEG, PNG, or GIF image.');
  }
  
  if (file.size > maxSize) {
    throw new Error('File size too large. Please select a file smaller than 5MB.');
  }
  
  return true;
};
```

### 3. CORS and Headers
```javascript
// Proper headers for different request types
const getRequestConfig = (method, data, isFormData = false) => {
  const token = localStorage.getItem('token');
  
  const config = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  
  if (data) {
    if (isFormData) {
      // Don't set Content-Type for FormData
      config.body = data;
    } else {
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(data);
    }
  }
  
  return config;
};
```

## Adding New API Features

### Step-by-Step Process:

#### 1. Define the API Endpoint
```javascript
// Add to src/api.js
const API = {
  // Existing endpoints...
  
  // New feature endpoints
  nfts: `${API_BASE_URL}/api/nfts`,
  createNFT: `${API_BASE_URL}/api/nfts/create`,
  userNFTs: `${API_BASE_URL}/api/user/nfts`,
  likeNFT: (id) => `${API_BASE_URL}/api/nfts/${id}/like`,
};
```

#### 2. Create API Service Functions
```javascript
// src/services/nftService.js
export const nftService = {
  // Get all NFTs
  getAllNFTs: async () => {
    const response = await fetch(API.nfts);
    return handleApiResponse(response);
  },

  // Create new NFT
  createNFT: async (nftData) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    formData.append('name', nftData.name);
    formData.append('description', nftData.description);
    formData.append('image', nftData.image);
    formData.append('price', nftData.price);

    const response = await fetch(API.createNFT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return handleApiResponse(response);
  },

  // Get user's NFTs
  getUserNFTs: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(API.userNFTs, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleApiResponse(response);
  },

  // Like/Unlike NFT
  toggleLike: async (nftId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(API.likeNFT(nftId), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleApiResponse(response);
  },
};
```

#### 3. Create React Hook for the Feature
```javascript
// src/hooks/useNFTs.js
import { useState, useEffect } from 'react';
import { nftService } from '../services/nftService';

export const useNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNFTs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await nftService.getAllNFTs();
      setNfts(data.nfts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createNFT = async (nftData) => {
    try {
      const newNFT = await nftService.createNFT(nftData);
      setNfts(prev => [newNFT, ...prev]);
      return newNFT;
    } catch (error) {
      throw error;
    }
  };

  const toggleLike = async (nftId) => {
    try {
      await nftService.toggleLike(nftId);
      setNfts(prev => prev.map(nft => 
        nft.id === nftId 
          ? { ...nft, liked: !nft.liked, likes: nft.liked ? nft.likes - 1 : nft.likes + 1 }
          : nft
      ));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return {
    nfts,
    loading,
    error,
    createNFT,
    toggleLike,
    refetch: fetchNFTs,
  };
};
```

#### 4. Use in Components
```javascript
// src/pages/Marketplace.jsx
import { useNFTs } from '../hooks/useNFTs';

const Marketplace = () => {
  const { nfts, loading, error, toggleLike } = useNFTs();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map(nft => (
        <NFTCard 
          key={nft.id} 
          nft={nft} 
          onLike={() => toggleLike(nft.id)}
        />
      ))}
    </div>
  );
};
```

## Testing and Debugging

### 1. API Testing with Browser DevTools
```javascript
// Add debug logging
const makeApiCall = async (url, options) => {
  console.log('API Request:', { url, options });
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log('API Response:', { status: response.status, data });
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

### 2. Network Tab Debugging
- Open DevTools (F12) → Network tab
- Filter by XHR/Fetch to see API calls
- Check request headers, payload, and response
- Look for status codes and error messages

### 3. Error Boundary for API Errors
```javascript
// src/components/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 4. API Mock for Development
```javascript
// src/services/mockApi.js
const MOCK_DELAY = 1000;

export const mockApi = {
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    if (email === 'test@example.com' && password === 'password') {
      return {
        success: true,
        user: { id: 1, username: 'Test User', email },
        token: 'mock-jwt-token',
      };
    }
    
    throw new Error('Invalid credentials');
  },

  getUserProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return {
      success: true,
      user: { id: 1, username: 'Test User', email: 'test@example.com' },
    };
  },
};

// Use in development
const isDevelopment = process.env.NODE_ENV === 'development';
const apiService = isDevelopment ? mockApi : realApi;
```

This comprehensive guide covers all aspects of backend integration in your NFT Marketplace project, from basic API calls to advanced patterns like optimistic updates and error handling. It provides a solid foundation for understanding and extending the backend integration.
