// Dummy data for authentication and NFTs
export const dummyUsers = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 2,
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 3,
    username: 'crypto_artist',
    email: 'artist@example.com',
    password: 'password123',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
];

export const dummyNFTs = [
  {
    id: 1,
    name: 'Cosmic Dreams #001',
    image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=400&fit=crop',
    owner: 'crypto_artist',
    price: '2.5',
    description: 'A beautiful cosmic artwork representing dreams and aspirations'
  },
  {
    id: 2,
    name: 'Digital Sunset',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
    owner: 'jane_smith',
    price: '1.8',
    description: 'A stunning digital representation of a sunset'
  },
  {
    id: 3,
    name: 'Abstract Geometry',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop',
    owner: 'john_doe',
    price: '3.2',
    description: 'Modern abstract geometric patterns'
  },
  {
    id: 4,
    name: 'Neon City',
    image: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400&h=400&fit=crop',
    owner: 'crypto_artist',
    price: '4.1',
    description: 'Cyberpunk inspired neon cityscape'
  },
  {
    id: 5,
    name: 'Ocean Waves',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
    owner: 'jane_smith',
    price: '2.0',
    description: 'Peaceful ocean waves in digital art form'
  },
  {
    id: 6,
    name: 'Space Explorer',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop',
    owner: 'john_doe',
    price: '5.5',
    description: 'Journey through space and time'
  }
];

// Authentication helper functions
export const authenticateUser = (email, password) => {
  const user = dummyUsers.find(u => u.email === email && u.password === password);
  if (user) {
    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

export const registerUser = (userData) => {
  // Check if user already exists
  const existingUser = dummyUsers.find(u => u.email === userData.email || u.username === userData.username);
  if (existingUser) {
    return { error: 'User already exists' };
  }
  
  // Create new user
  const newUser = {
    id: dummyUsers.length + 1,
    ...userData,
    profilePicture: userData.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
  };
  
  dummyUsers.push(newUser);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};
