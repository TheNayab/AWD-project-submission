"use client"

// WebSocketHandler.js
import { useEffect } from "react";
import io from "socket.io-client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const EmployeeAutoLogout = ({ onLogout }) => {

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL_SOCKET}`);

    // socket.on("employee-logout", () => {
    // //   console.log("logout event received");
      
    //   localStorage.removeItem("employee_access_token");
    //   router.push("/emp/login");
      
    //   onLogout(); // Call the onLogout callback to trigger logout actions
    // });

    socket.on("employee-logout", () => {
      // Check if the pathname contains "emp"
      if (pathname.includes("emp")) {
        localStorage.removeItem("employee_access_token");
        router.push("/emp/login");
        onLogout(); // Call the onLogout callback to trigger logout actions
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null; // WebSocket handler doesn't render any UI
};

export default EmployeeAutoLogout ;
