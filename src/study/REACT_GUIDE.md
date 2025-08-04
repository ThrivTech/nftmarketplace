# React Learning Guide - NFT Marketplace Project

## Table of Contents
1. [React Fundamentals](#react-fundamentals)
2. [Project Architecture](#project-architecture)
3. [Components Breakdown](#components-breakdown)
4. [React Hooks Used](#react-hooks-used)
5. [Routing Implementation](#routing-implementation)
6. [State Management](#state-management)
7. [Adding New Features](#adding-new-features)

## React Fundamentals

### What is React?
React is a JavaScript library for building user interfaces, especially web applications. It uses a component-based architecture where you build encapsulated components that manage their own state.

### Key Concepts in Our Project:

#### 1. **Components**
Components are the building blocks of React applications. They're like JavaScript functions that return JSX (HTML-like syntax).

```jsx
// Functional Component Example
const MyComponent = ({ prop1, prop2 }) => {
  return (
    <div>
      <h1>{prop1}</h1>
      <p>{prop2}</p>
    </div>
  );
};
```

#### 2. **JSX (JavaScript XML)**
JSX allows you to write HTML-like syntax in JavaScript:

```jsx
const element = <h1>Hello, World!</h1>;
const dynamicElement = <h1>Hello, {userName}!</h1>;
```

#### 3. **Props**
Props are how you pass data from parent to child components:

```jsx
// Parent Component
<NavigationBar user={user} theme={theme} onLogout={handleLogout} />

// Child Component receives props
const NavigationBar = ({ user, theme, onLogout }) => {
  // Use props here
};
```

## Project Architecture

```
src/
├── components/          # Reusable UI components
│   ├── NavigationBar.jsx
│   ├── Footer.jsx
│   ├── ListView.jsx
│   └── ThemeToggleButton.jsx
├── pages/              # Full page components
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Marketplace.jsx
│   ├── CreateNFT.jsx
│   ├── MyNFTs.jsx
│   └── Profile.jsx
├── data/               # Static data and mock data
│   └── dummyNFTs.js
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
├── api.js              # API configuration
└── index.css           # Global styles
```

### Architecture Principles:

1. **Component Separation**: 
   - `components/` = Reusable pieces (NavigationBar, Footer)
   - `pages/` = Full page views (Login, Marketplace)

2. **Single Responsibility**: Each component has one main purpose

3. **Props Down, Events Up**: Data flows down via props, events bubble up via callbacks

## Components Breakdown

### 1. App.jsx (Main Container)
```jsx
function App() {
  // Global state management
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  
  // Handles routing and global state
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/marketplace" element={<Marketplace />} />
        {/* More routes */}
      </Routes>
    </Router>
  );
}
```

**Purpose**: 
- Manages global state (user, theme)
- Handles routing between pages
- Provides authentication logic

### 2. NavigationBar.jsx (Reusable Component)
```jsx
const NavigationBar = ({ user, onLogout, theme, setTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white dark:bg-slate-900">
      {/* Navigation content */}
    </nav>
  );
};
```

**Purpose**:
- Provides navigation across the app
- Shows user info and logout option
- Responsive design (mobile menu)

### 3. Page Components (Login, Marketplace, etc.)
```jsx
const Marketplace = ({ user, onLogout, theme, setTheme }) => {
  return (
    <div className="min-h-screen">
      <NavigationBar user={user} onLogout={onLogout} />
      <main>
        <ListView items={dummyNFTs} />
      </main>
      <Footer />
    </div>
  );
};
```

**Purpose**:
- Represents full pages
- Combines multiple components
- Handles page-specific logic

## React Hooks Used

### 1. useState Hook
Manages component state (data that can change):

```jsx
const [theme, setTheme] = useState('light');
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(false);

// Usage
setTheme('dark');           // Updates theme
setUser(userData);          // Updates user
setLoading(true);          // Shows loading state
```

**In Our Project**:
- `theme` - Current theme (light/dark)
- `user` - Logged in user data
- `menuOpen` - Mobile menu state
- `loading` - Loading states for API calls

### 2. useEffect Hook
Handles side effects (API calls, DOM updates, subscriptions):

```jsx
useEffect(() => {
  // This runs after component mounts and when dependencies change
  document.documentElement.classList.add(theme);
  localStorage.setItem('theme', theme);
}, [theme]); // Dependency array - runs when theme changes

useEffect(() => {
  // This runs only once after component mounts
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
}, []); // Empty dependency array = runs once
```

**Common Patterns**:
- **Component Mount**: `useEffect(() => {}, [])` - runs once
- **State Change**: `useEffect(() => {}, [state])` - runs when state changes
- **Cleanup**: `useEffect(() => { return () => cleanup(); }, [])`

### 3. Custom Hooks (Potential)
You can create custom hooks for reusable logic:

```jsx
// Custom hook for API calls
const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading };
};

// Usage in component
const MyComponent = () => {
  const { data, loading } = useApi('/api/nfts');
  
  if (loading) return <div>Loading...</div>;
  return <div>{data.map(item => <div key={item.id}>{item.name}</div>)}</div>;
};
```

## Routing Implementation

### React Router Setup
```jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
```

### Navigation Between Pages
```jsx
import { Link, useNavigate } from 'react-router-dom';

// Using Link component
<Link to="/marketplace">Go to Marketplace</Link>

// Using useNavigate hook for programmatic navigation
const navigate = useNavigate();
const handleLogin = () => {
  // After successful login
  navigate('/marketplace');
};
```

### Protected Routes
```jsx
<Route
  path="/marketplace"
  element={
    user ? (
      <Marketplace user={user} />
    ) : (
      <Navigate to="/" replace />
    )
  }
/>
```

## State Management

### Local State (useState)
For component-specific data:
```jsx
const [formData, setFormData] = useState({
  name: '',
  email: ''
});
```

### Global State (Props Drilling)
Passing state through component hierarchy:
```jsx
// App.jsx
const [user, setUser] = useState(null);

// Pass down to children
<Marketplace user={user} onUserUpdate={setUser} />

// In Marketplace
<NavigationBar user={user} />
```

### Alternative: Context API (For Complex Apps)
```jsx
// Create context
const UserContext = createContext();

// Provider
<UserContext.Provider value={{ user, setUser }}>
  <App />
</UserContext.Provider>

// Consumer
const { user, setUser } = useContext(UserContext);
```

## Adding New Features

### Step-by-Step Process:

#### 1. Plan the Feature
- What does it do?
- What data does it need?
- Which components are affected?

#### 2. Create New Components (if needed)
```jsx
// src/components/NewFeature.jsx
const NewFeature = ({ prop1, prop2, onAction }) => {
  const [localState, setLocalState] = useState(initialValue);
  
  const handleSomething = () => {
    // Feature logic
    onAction(data); // Communicate with parent
  };
  
  return (
    <div className="feature-container">
      {/* Feature UI */}
    </div>
  );
};

export default NewFeature;
```

#### 3. Add Routes (if it's a new page)
```jsx
// In App.jsx
import NewPage from './pages/NewPage';

// Add to routes
<Route 
  path="/new-feature" 
  element={
    user ? (
      <NewPage user={user} />
    ) : (
      <Navigate to="/" />
    )
  } 
/>
```

#### 4. Update Navigation
```jsx
// In NavigationBar.jsx
const navigationLinks = [
  { title: "Marketplace", path: "/marketplace" },
  { title: "My NFTs", path: "/my-nfts" },
  { title: "Create", path: "/create-nft" },
  { title: "New Feature", path: "/new-feature" }, // Add this
];
```

#### 5. Handle State Updates
```jsx
// If feature affects global state
const handleFeatureUpdate = (newData) => {
  setUser(prevUser => ({
    ...prevUser,
    newProperty: newData
  }));
};
```

### Example: Adding a "Favorites" Feature

#### 1. Add to User State
```jsx
const [user, setUser] = useState({
  // existing properties
  favorites: [] // Add favorites array
});
```

#### 2. Create Favorites Component
```jsx
const Favorites = ({ user, onToggleFavorite }) => {
  return (
    <div>
      {user.favorites.map(nft => (
        <NFTCard 
          key={nft.id} 
          nft={nft} 
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};
```

#### 3. Add Toggle Logic
```jsx
const toggleFavorite = (nftId) => {
  setUser(prevUser => ({
    ...prevUser,
    favorites: prevUser.favorites.includes(nftId)
      ? prevUser.favorites.filter(id => id !== nftId)
      : [...prevUser.favorites, nftId]
  }));
};
```

#### 4. Add Route and Navigation
```jsx
// Route
<Route path="/favorites" element={<Favorites user={user} />} />

// Navigation link
{ title: "Favorites", path: "/favorites" }
```

## Best Practices

### 1. Component Organization
- Keep components small and focused
- Use descriptive names
- Group related components

### 2. State Management
- Keep state as local as possible
- Lift state up when multiple components need it
- Use meaningful state variable names

### 3. Props
- Use destructuring for cleaner code
- Provide default values when appropriate
- Use PropTypes or TypeScript for type checking

### 4. Performance
- Use React.memo for expensive components
- Avoid creating objects/functions in render
- Use useCallback and useMemo when needed

### 5. Code Style
- Use consistent naming conventions
- Keep functions pure when possible
- Handle errors gracefully

## Common Patterns in Our Project

### 1. Conditional Rendering
```jsx
{user ? (
  <UserProfile user={user} />
) : (
  <LoginPrompt />
)}

{loading && <LoadingSpinner />}

{error && <ErrorMessage error={error} />}
```

### 2. List Rendering
```jsx
{nfts.map(nft => (
  <NFTCard 
    key={nft.id} 
    nft={nft} 
    onSelect={handleSelect}
  />
))}
```

### 3. Form Handling
```jsx
const [formData, setFormData] = useState({ name: '', email: '' });

const handleChange = (e) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};

const handleSubmit = (e) => {
  e.preventDefault();
  // Process form data
};
```

### 4. API Integration
```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

This guide covers the React concepts used in your NFT Marketplace project. Each concept builds on the previous ones, creating a solid foundation for React development.
