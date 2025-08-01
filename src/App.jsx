// src/App.jsx
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
import CreateNFT from "./pages/CreateNFT";
import MyNFTs from "./pages/MyNFTs";
import ThemeToggleButton from "./components/ThemeToggleButton";

function App() {
  const [theme, setTheme] = useState(() => {
    if (localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
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
        {!user && (
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggleButton theme={theme} setTheme={setTheme} />
          </div>
        )}
        <Routes>
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
          <Route
            path="/marketplace"
            element={
              user ? (
                <Marketplace
                  user={user}
                  onLogout={handleLogout}
                  theme={theme}
                  setTheme={setTheme}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/create-nft"
            element={
              user ? (
                <CreateNFT
                  user={user}
                  theme={theme}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/my-nfts"
            element={
              user ? (
                <MyNFTs
                  user={user}
                  theme={theme}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
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
