"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

export  const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('admin_access_token');

    // If the token exists, decode it to get user information
    if (token) {
      const decodedToken = jwtDecode(token);

      // Assuming that the role is stored in the decoded token
      const role = decodedToken?.role;
      console.log("role",role)

      // Set userRole in state
      setUserRole(role); 
    }
  }, []);

  const contextValue = {
    userRole,
    setUserRole,
    // Add other functions or states related to authentication
  };

  return <AuthContext.Provider value={{contextValue}}>{children}</AuthContext.Provider>;
};
