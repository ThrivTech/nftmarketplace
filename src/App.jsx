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
import Profile from "./pages/Profile";
import ThemeToggleButton from "./components/ThemeToggleButton";
import API from './api';

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const restoreSession = async () => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (savedUser && savedUser !== "undefined" && savedUser !== "null" && token) {
        try {
          const parsedUser = JSON.parse(savedUser);

          // ✅ FIXED: use `name` instead of `id` for validity check
          if (parsedUser && typeof parsedUser === 'object' && parsedUser.name) {
            const rawPic = parsedUser.profilePic || parsedUser.profilePicture;

            const normalizedUser = {
              ...parsedUser,
              username: parsedUser.username || parsedUser.name || "User",
              profilePicture: rawPic?.startsWith("http")
                ? rawPic
                : `https://nftbackend-qz6p.onrender.com/${rawPic?.replace(/^\/+/, "")}`,
            };

            setUser(normalizedUser);
            localStorage.setItem("user", JSON.stringify(normalizedUser));
          } else {
            throw new Error("Invalid user data");
          }
        } catch (error) {
          console.error("Session restoration failed:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        if (savedUser === "undefined" || savedUser === "null") {
          localStorage.removeItem("user");
        }
        if (!token) {
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const handleLogin = (userData) => {
    const rawPic = userData.profilePic || userData.profilePicture || userData.avatar;
    const normalizedUser = {
      ...userData,
      username: userData.username || userData.name || "User",
      profilePicture: rawPic?.startsWith("http")
        ? rawPic
        : rawPic
        ? `https://nftbackend-qz6p.onrender.com/${rawPic.replace(/^\/+/, "")}`
        : "",
    };
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

 const handleUserUpdate = (updatedUser) => {
  setUser(updatedUser);
  localStorage.setItem("user", JSON.stringify(updatedUser));
};


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Router>
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggleButton theme={theme} setTheme={setTheme} />
        </div>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/marketplace" replace />
              ) : (
                <Login onLogin={handleLogin} theme={theme} setTheme={setTheme} />
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
                <CreateNFT user={user} theme={theme} setTheme={setTheme} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/my-nfts"
            element={
              user ? (
                <MyNFTs user={user} theme={theme} setTheme={setTheme} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              user ? (
                <Profile
                  user={user}
                  onUserUpdate={handleUserUpdate}
                  theme={theme}
                  setTheme={setTheme}
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
