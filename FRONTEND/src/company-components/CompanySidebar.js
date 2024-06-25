// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useContext } from "react";
// import { SidebarContext } from "@/context/Sidebarcontext";

// const CompanySidebar = () => {
//   const { isSidebarOpen,toggleSidebar,handleLinkClick} = useContext(SidebarContext);

//   const pathname = usePathname();

//   const sidebarLinks = [
//     { href: "/company/employees", label: "Employees", icon: "/assets/employees.svg" },
//     { href: "/company/customers", label: "Customers", icon: "/assets/contacts.svg" },
//     { href: "/company/chats", label: "Chats", icon: "/assets/chats.svg" },
//     { href: "/company/accounts", label: "Accounts", icon: "/assets/accounts.svg" },
//     { href: "/company/profile", label: "My Profile", icon: "/assets/profile.svg" },
//   ];

  

//   return (
//     <nav
//       className={`py-[24px] px-[16px] gap-2 bg-white mt-[5px]
//       ${isSidebarOpen ? "w-[300px] duration-300" : "sidebar-closed"}`}
//     >
//       <ul className="">
//         {sidebarLinks.map(({ href, label, icon }, index) => (
//           <li key={index} className="">
//             <Link href={href}>
//               {/* <div className='flex items-center py-[9px] px-[18px] rounded-xl gap-[27px]'> */}
//               <div
//                 className={`flex items-center py-[9px] px-[18px] rounded-xl gap-[27px] ${
//                   pathname === href ? "bg-[#2D8AC5]" : ""
//                 }`}
//                 onClick={handleLinkClick}
//               >
//                 <Image
//                   src={icon}
//                   alt={label}
//                   height={26}
//                   width={26}
//                   className={`${
//                     pathname === href ? "invert brightness-50" : ""
//                   }`}
//                 />
//                 <span
//                   className={`text-[16px] text-[#343233] font-normal leading-[19px] ${
//                     pathname === href ? "text-white" : "text-[#343233]"
//                   } ${isSidebarOpen ? "" : "hidden"}`}
//                 >
//                   {label}
//                 </span>
//               </div>
//             </Link>
//           </li>
//         ))}

//         {/* Logout button for small devices */}

//         <li className="">
//           <div className="flex md:hidden items-center py-[9px] px-[18px] rounded-xl gap-[27px]">
//             <Image
//               src="/assets/logout.svg"
//               width={26}
//               height={26}
//               alt="logout button"
//             />
//             <button
//               className={`text-[16px] text-[#343233] font-normal leading-[19px] ${
//                 isSidebarOpen ? "" : "hidden"
//               }`}
//             >
//               Logout
//             </button>
//           </div>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default CompanySidebar;
"use client"
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarContext } from "@/context/Sidebarcontext";
import { ThreeDots } from 'react-loader-spinner';

const CompanySidebar = () => {
  const { isSidebarOpen, toggleSidebar, handleLinkClick } = useContext(
    SidebarContext
  );
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const pathname = usePathname();

  const sidebarLinks = [
    { href: "/company/employees", label: "Employees", icon: "/assets/employees.svg" },
    { href: "/company/customers", label: "Customers", icon: "/assets/contacts.svg" },
    { href: "/company/chats", label: "Chats", icon: "/assets/chats.svg" },
    { href: "/company/accounts", label: "Accounts", icon: "/assets/accounts.svg" },
    { href: "/company/profile", label: "My Profile", icon: "/assets/profile.svg" },
  ];

  const handleLinkClickWithLoading = () => {
    setIsLoading(true); // Set loading to true when link is clicked
    handleLinkClick(); // Call your existing handleLinkClick function
  };

  useEffect(() => {
    setIsLoading(false); // Set loading to false after the component has rendered
  }, [pathname]);

  return (
    <nav
      className={`py-[24px] px-[16px] gap-2 bg-white mt-[5px]
      ${isSidebarOpen ? "w-[300px] duration-300" : "sidebar-closed"}`}
    >
      <ul className="">
        {sidebarLinks.map(({ href, label, icon }, index) => (
          <li key={index} className="">
            <Link href={href}>
              <div
                className={`flex items-center py-[9px] px-[18px] rounded-xl gap-[27px] ${
                  pathname === href ? "bg-[#2D8AC5]" : ""
                }`}
                onClick={handleLinkClickWithLoading} // Use the new click handler
              >
                <Image
                  src={icon}
                  alt={label}
                  height={26}
                  width={26}
                  className={`${
                    pathname === href ? "invert brightness-50" : ""
                  }`}
                />
                <span
                  className={`text-[16px] text-[#343233] font-normal leading-[19px] ${
                    pathname === href ? "text-white" : "text-[#343233]"
                  } ${isSidebarOpen ? "" : "hidden"}`}
                >
                  {label}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    

{isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ThreeDots type="Puff" color="#fff" height={50} width={50} />
        </div>
      )}
    </nav>
  );
};

export default CompanySidebar;
