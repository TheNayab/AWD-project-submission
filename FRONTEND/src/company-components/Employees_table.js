import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { ThreeDots } from 'react-loader-spinner';

    // components/EmployeeTable.js
    const Employee_table = ({ employees }) => {

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
                <th className="employees-table-th-styles rounded-l-[12px]">EMPLOYEE NAME</th>
                <th className="employees-table-th-styles">EMAIL</th>
                <th className="employees-table-th-styles">CONTACT</th>
                <th className="employees-table-th-styles rounded-r-[12px] ">ACTIONS</th>
            </tr>
            </thead>
            <tbody>
            {employees.map((employee, index) => (
                <tr key={index}>
                <td className="employees-table-tr-styles pl-2">{employee.name}</td>
                <td className="employees-table-tr-styles pl-2">{employee.email}</td>
                <td className="employees-table-tr-styles pl-2">{employee.phone}</td>
                <td className="">
                    
                   {/* <Link href="/company/edit-employees">
                   <button className="bg-[#F7F7F7] py-[9px] my-2 px-[24px] rounded-[50px] text-[14px] text-[#2D8AC5] leading-4 font-normal">Edit</button>
                   </Link> */}
                    <Link onClick={handleLinkClickWithLoading} href={`/company/edit-employees?c_id=${employee.company_id}&e_id=${employee.employee_id}`}>
                    <button className="bg-[#F7F7F7] py-[9px] my-2 px-[24px] rounded-[50px] text-[14px] text-[#2D8AC5] leading-4 font-normal">Edit</button>
                  </Link>
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
    
    export default Employee_table;
    