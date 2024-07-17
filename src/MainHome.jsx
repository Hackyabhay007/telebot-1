import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNavBar from './components/BottomNavBar';
import Home from './components/Home';
import Games from './components/Games';
function MainHome() {
  return (
 
    <div className="min-h-screen text-primary font-body bg-custom-gradient from-zinc-800 to-violet-900">
      <Games/>
    <BottomNavBar />
  </div>
   
    
  );
}

export default MainHome;