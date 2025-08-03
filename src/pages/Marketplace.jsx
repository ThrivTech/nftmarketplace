import React from 'react';
import NavigationBar from '../components/NavigationBar';
import ListView from '../components/ListView';
import Footer from '../components/Footer';
import { dummyNFTs } from '../data/dummyNFTs';

const Marketplace = ({ user, onLogout, theme, setTheme }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <NavigationBar 
        user={user} 
        onLogout={onLogout} 
        theme={theme} 
        setTheme={setTheme} 
      />
      <main className="flex-1">
        <ListView items={dummyNFTs} />
      </main>
      <Footer />
    </div>
  );
};

export default Marketplace;