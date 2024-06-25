import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { ThreeDots } from 'react-loader-spinner';

    // components/EmployeeTable.js
    const Customer_table = ({ customers }) => {

        const [loading, setLoading] = useState(true);

        const pathname = usePathname();

        const handleLinkClickWithLoading = () => {
            setLoading(true); // Set loading to true when link is clicked
            // handleLinkClick(); // Call your existing handleLinkClick function
          };
        
          useEffect(() => {
            setLoading(false); // Set loading to false after the component has rendered
          }, [pathname]);

        return (
        
            <table className="min-w-full">
            <thead className="bg-[#F4F4F6]">
            <tr>
                <th className="employees-table-th-styles rounded-l-[12px]">CUSTOMER NAME</th>
                <th className="employees-table-th-styles">EMAIL</th>
                <th className="employees-table-th-styles">CONTACT</th>
                <th className="employees-table-th-styles rounded-r-[12px] ">ACTIONS</th>
            </tr>
            </thead>
            <tbody>
            {customers.map((customer, index) => (
                <tr key={index}>
                <td className="employees-table-tr-styles pl-2">{customer.name}</td>
                <td className="employees-table-tr-styles pl-2">{customer.email}</td>
                <td className="employees-table-tr-styles pl-2">{customer.phone}</td>
                <td className="">
                    
                   <div className="flex">
                   <Link onClick={handleLinkClickWithLoading} href={`/company/edit-customers?c_id=${customer.company_id}&cu_id=${customer.customer_id}`}>
                   <button className="bg-[#F7F7F7] py-[6px] md:py-[9px] my-2 px-[16px] md:px-[24px] rounded-[50px] text-[14px] text-[#2D8AC5] md:leading-4 font-normal mr-2">Edit</button>
                   </Link>
                   <Link onClick={handleLinkClickWithLoading} href="">
                   <button className="bg-[#F7F7F7] py-[6px] md:py-[9px] my-2 px-[16px] md:px-[24px] rounded-[50px] text-[14px] text-[#2D8AC5] md:leading-4 font-normal">Chat</button>
                   </Link>
                   </div>
                   {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <ThreeDots type="Puff" color="#fff" height={50} width={50} />
                </div>
            )}
                    
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        
        );
    };
    
    export default Customer_table;
    