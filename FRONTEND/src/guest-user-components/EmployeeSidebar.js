"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { SidebarContext } from "@/context/Sidebarcontext";

const EmployeeSidebar = () => {
  const { isSidebarOpen,toggleSidebar,handleLinkClick} = useContext(SidebarContext);

  const pathname = usePathname();

  const sidebarLinks = [
    
    { href: "/emp/chats", label: "Chats", icon: "/assets/chats.svg" },
    
  ];

  

  return (
    <nav
      className={`py-[24px] px-[16px] gap-2 bg-white mt-[5px]
      ${isSidebarOpen ? "w-[300px] duration-300" : "sidebar-closed"}`}
    >
      <ul className="">
        {sidebarLinks.map(({ href, label, icon }, index) => (
          <li key={index} className="">
            <Link href={href}>
              {/* <div className='flex items-center py-[9px] px-[18px] rounded-xl gap-[27px]'> */}
              <div
                className={`flex items-center py-[9px] px-[18px] rounded-xl gap-[27px] ${
                  pathname === href || '/' ? "bg-[#2D8AC5]" : ""
                }`}
                onClick={handleLinkClick}
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

        {/* Logout button for small devices */}

        <li className="">
          <div className="flex md:hidden items-center py-[9px] px-[18px] rounded-xl gap-[27px]">
            <Image
              src="/assets/logout.svg"
              width={26}
              height={26}
              alt="logout button"
            />
            <button
              className={`text-[16px] text-[#343233] font-normal leading-[19px] ${
                isSidebarOpen ? "" : "hidden"
              }`}
            >
              Logout
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default EmployeeSidebar;
