import Link from "next/link";
import moment from "moment";
import React, { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { ThreeDots } from 'react-loader-spinner';

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
    <div className="flex flex-col items-center">
      {employees.length === 0 ? (
        <div className="text-center my-8">
          <p>No employee registered yet.</p>
          <Link href="/admin/add-employees">
            <button className="bg-[#2D8AC5] py-[6px] md:py-[9px] px-[16px] md:px-[24px] rounded-[50px] text-white font-normal mt-4">
              Register Employee
            </button>
          </Link>
        </div>
      ) : (
        <table className="min-w-full">
          <thead className="bg-[#F4F4F6]">
            <tr>
              <th className="employees-table-th-styles rounded-l-[12px]">EMPLOYEE NAME</th>
              <th className="employees-table-th-styles">COMPANY</th>
              <th className="employees-table-th-styles">EMAIL</th>
              <th className="employees-table-th-styles">LAST UPDATED</th>
              <th className="employees-table-th-styles rounded-r-[12px] ">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={index}>
                <td className="employees-table-tr-styles pl-2">{employee.name}</td>
                <td className="employees-table-tr-styles pl-2">{employee.company}</td>
                <td className="employees-table-tr-styles pl-2">{employee.email}</td>
                <td className="employees-table-tr-styles pl-2">
                  {moment(employee.updated_at).format("DD-MM-YYYY")}
                </td>
                <td className="">
                  <Link onClick={handleLinkClickWithLoading} href={`/admin/edit-employees?c_id=${employee.company_id}&e_id=${employee.employee_id}&c_name=${employee.company}`}>
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
      )}
    </div>
  );
};

export default Employee_table;
