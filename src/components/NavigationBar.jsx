import React, { useState } from "react";
import { Menu, X, LogOut, User, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import GlobalThemeToggle from "./ThemeToggleButton";

const NavigationBar = ({ user, onLogout, theme, setTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const navigationLinks = [
    { title: "Marketplace", path: "/marketplace" },
    { title: "My NFTs", path: "/my-nfts" },
    { title: "Create", path: "/create-nft" },
    { title: "Activity", path: "/activity" }, // optional
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    onLogout();
  };

  // ✅ FIXED: Toggle theme and apply immediately to DOM
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Apply theme to document immediately
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              NFTStorm
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          {/* User Profile, Theme Toggle & Logout */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* ✅ FIXED: Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user?.username || "User"}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
              <GlobalThemeToggle theme={theme} setTheme={setTheme} />

            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-label="Toggle Menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            {navigationLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                {link.title}
              </Link>
            ))}

            {/* ✅ FIXED: Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
              <span>Switch to {theme === 'light' ? 'dark' : 'light'} mode</span>
            </button>

            {/* Mobile User Profile */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 pb-3">
              <div className="flex items-center px-3 space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-base font-medium text-slate-900 dark:text-slate-100">
                    {user?.username || "User"}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {user?.email || "user@example.com"}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
                <GlobalThemeToggle theme={theme} setTheme={setTheme} />

              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;