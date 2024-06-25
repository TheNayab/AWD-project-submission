
"use client"
import { createContext, useState, useEffect } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevIsSidebarOpen) => !prevIsSidebarOpen);
  };

  const handleLinkClick = () => {
    // Close the sidebar only if the screen size is less than 768 pixels
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    if (mediaQuery.matches) {
      toggleSidebar();
    }
    // Add logic for handling link clicks
    // ...
  };

  useEffect(() => {
    const handleResize = () => {
      const mediaQuery = window.matchMedia('(max-width: 1024px)');
      setIsSidebarOpen(!mediaQuery.matches);
    };

    // Initial check on component mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, handleLinkClick }}>
      {children}
    </SidebarContext.Provider>
  );
};
