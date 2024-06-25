
"use client"
import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";

// Create a new context for socket
const SocketContext = createContext();

// Custom hook to access socket context
export const useSocket = () => useContext(SocketContext);

// Socket provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  // Effect to initialize socket connection
  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_BASE_URL_SOCKET}`);
    

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
