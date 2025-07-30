import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => (
  <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            © 2025 NFT Marketplace. Made with
          </span>
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            for creators
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          <a
            href="#privacy"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#terms"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#support"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            Support
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
