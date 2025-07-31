import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import Marketplace from "./pages/Marketplace";
import ThemeToggleButton from "./components/ThemeToggleButton";
import CreateNFT from "./pages/CreateNFT";
import MyNFTs from "./pages/MyNFTs";

function App() {
  const [theme, setTheme] = useState(() => {
    // Initialize theme from local storage or system preference
    if (localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [user, setUser] = useState(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="min-h-screen theme-bg-primary">
      <Router>
        {/* Theme toggle button - available on all pages */}
        <ThemeToggleButton theme={theme} setTheme={setTheme} />

        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/marketplace" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              user ? (
                <Navigate to="/marketplace" replace />
              ) : (
                <Signup onLogin={handleLogin} />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/marketplace"
            element={
              user ? (
                <Marketplace user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/create-nft"
            element={
              user ? (
                <CreateNFT user={user} theme={theme} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/my-nfts"
            element={
              user ? (
                <MyNFTs isDark={theme === "dark"} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Catch all route */}
          <Route
            path="*"
            element={<Navigate to={user ? "/marketplace" : "/"} replace />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
