"use client"

// WebSocketHandler.js
import { useEffect } from "react";
import io from "socket.io-client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const CompanyAutoLogout = ({ onLogout }) => {

  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL_SOCKET}`);

    // socket.on("logout", () => {
    // //   console.log("logout event received");
      
    //   localStorage.removeItem("company_access_token");
      
    //   onLogout(); // Call the onLogout callback to trigger logout actions
    // });

    socket.on("logout", () => {
      // Check if the pathname contains "emp"
      if (pathname.includes("company")) {
        localStorage.removeItem("company_access_token");
        router.push("/company/login");
        onLogout(); // Call the onLogout callback to trigger logout actions
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null; // WebSocket handler doesn't render any UI
};

export default CompanyAutoLogout ;
