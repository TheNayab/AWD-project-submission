"use client";
import Company_component from "@/components/Company_component";
import Chats_component from "@/employee-components/Chats_component";
import Employees_component from "@/company-components/Employees_component";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./globals.css";

export default function Home() {
  // State to hold the userRole
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedAdminToken = localStorage.getItem("admin_access_token");
    const storedCompanyToken = localStorage.getItem("company_access_token");
    const storedEmployeeToken = localStorage.getItem("employee_access_token");

    const getUserRole = (token) => {
      if (token) {
        // Decode the token to get user information
        const decodedToken = jwtDecode(token);

        // Check if 'role' is available in the decoded token
        if (decodedToken && decodedToken.role) {
          return decodedToken.role;
        } else {
          console.error("Role not found in decoded token");
        }
      }

      return null;
    };

    setUserRole(
      getUserRole(storedAdminToken) ||
        getUserRole(storedCompanyToken) ||
        getUserRole(storedEmployeeToken)
    );
  }, []);

  return (
    <div className="w-full">
      {userRole === "admin" && <Company_component />}
      {userRole === "company" && <Employees_component />}
      {userRole === "employee" && <Chats_component />}
    </div>
  );
}
