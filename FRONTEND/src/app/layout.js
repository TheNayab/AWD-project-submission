"use client";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import EmployeeHeader from "@/employee-components/EmployeeHeader";
import CompanyHeader from "@/company-components/CompanyHeader";
import SuperAdminSidebar from "@/components/SuperAdminSidebar";
import CompanySidebar from "@/company-components/CompanySidebar";
import EmployeeSidebar from "@/employee-components/EmployeeSidebar";
import { SidebarProvider } from "@/context/Sidebarcontext";
import { SocketProvider } from "@/context/SocketContext";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import GuestHeader from "@/guest-user-components/GuestHeader";
import CompanyAutoLogout from "@/company-components/CompanyAutoLogout";
import EmployeeAutoLogout from "@/employee-components/EmployeeAutoLogout";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


const inter = Work_Sans({ subsets: ["latin"] });

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  
  useEffect(() => {
    const intervalId = setInterval(() => {
      let adminToken = Cookies.get("admin_access_token");
      let companyToken = Cookies.get("company_access_token");
      let empToken = Cookies.get("employee_access_token");

      if (adminToken) {
        Cookies.set("admin_access_token", "");
      } else if (companyToken) {
        Cookies.set("company_access_token", "");
      } else if (empToken) {
        Cookies.set("employee_access_token", "");
      }
      console.log("runing from main after 2 days");
    }, 2 * 24 * 60 * 60 * 1000); //2 days in milliseconds
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedAdminToken = localStorage.getItem("admin_access_token");
      const storedCompanyToken = localStorage.getItem("company_access_token");
      const storedEmployeeToken = localStorage.getItem("employee_access_token");

      let adminToken = Cookies.get("admin_access_token");
      let companyToken = Cookies.get("company_access_token");
      let empToken = Cookies.get("employee_access_token");
      

      if (storedAdminToken && !adminToken) {
        localStorage.removeItem("admin_access_token");
        // toast.error("token Expire: please login again");
        router.push("/admin/login");
      } else if (storedCompanyToken && !companyToken) {
        localStorage.removeItem("company_access_token");
        // toast.error("token Expire: please login again");
        router.push("/company/login");
      } else if (storedEmployeeToken && !empToken) {
        localStorage.removeItem("employee_access_token");
        // toast.error("token Expire: please login again");
        router.push("/emp/login");
      }
      // console.log("runing from main after 1 min");
    }, 2 * 24 * 60 * 60 * 1000); // 2 days in milliseconds
    return () => clearInterval(intervalId);
  }, []);

  // State to hold the userRole
  const [userRole, setUserRole] = useState("");

  const handleCompanyAutoLogout = () => {
    // router.push("/company/login");
  };
  const handleEmployeeAutoLogout = () => {
    // router.push("/emp/login");
  };

  const updateSidebarBasedOnToken = () => {
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
  };

  // useEffect(() => {
  //   if (!userRole || userRole !== 'employee') {
  //     router.push('/emp/login');
  //   }
  // }, [userRole]);

  // return null; // Return null or loading indicator while determining user role


  // Update sidebar on initial load
  useEffect(() => {
    updateSidebarBasedOnToken();
  }, []);

  // Update sidebar on route changes
  useEffect(() => {
    updateSidebarBasedOnToken();
  }, [pathname]);

  // const userRole = "employee"; // Need to Replace with the actual user role
  return (
    <html lang="en">
      <body
        className={`${inter.className} omni-scroll-bar`}
        suppressHydrationWarning={true}
      >
        <SidebarProvider>
          <SocketProvider>
            <CompanyAutoLogout onLogout={handleCompanyAutoLogout} />
            <EmployeeAutoLogout onLogout={handleEmployeeAutoLogout} />
            {userRole === "admin" && pathname !== "/admin/login" && (
              <AdminHeader
                title="Omni Channel"
                profileImage="/assets/profile-img.svg"
              />
            )}
            {userRole === "company" && pathname !== "/admin/login" && (
              <CompanyHeader
                customerName="Company name"
                title="Omni Channel"
                profileImage="/assets/profile-img.svg"
              />
            )}
            {userRole === "employee" && pathname !== "/admin/login" && (
              <EmployeeHeader
                customerName="Employee name"
                title="Omni Channel"
                profileImage="/assets/profile-img.svg"
              />
            )}
            {userRole !== "employee" && pathname.startsWith("/guest/chats") && (
              <GuestHeader
                guestName="Hi Guest"
                title="Omni Channel"
                profileImage="/assets/profile-img.svg"
              />
            )}
            <div className="flex">
              <div className="flex">
                {/* {pathname !== "/login" && <SuperAdminSidebar />} */}
                {userRole === "admin" && pathname !== "/admin/login" && (
                  <SuperAdminSidebar />
                )}
                {userRole === "company" && pathname !== "/admin/login" && (
                  <CompanySidebar />
                )}
                {userRole === "employee" && pathname !== "/admin/login" && (
                  <EmployeeSidebar />
                )}
              </div>
              {children}
            </div>
          </SocketProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}