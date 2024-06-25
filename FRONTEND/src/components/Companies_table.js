import Link from "next/link";
import moment from "moment";
import React, { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { ThreeDots } from 'react-loader-spinner';

const Companies_table = ({ companies }) => {

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
      {companies.length === 0 ? (
        <div className="text-center my-8">
          <p>No company registered yet.</p>
          <Link href="/admin/add-company">
            
            <button className="bg-[#2D8AC5] py-[6px] md:py-[9px] px-[16px] md:px-[24px] rounded-[50px] text-white font-normal mt-4">
              Register Company
            </button>
          </Link>
        </div>
      ) : (
        <table className="min-w-full">
          <thead className="bg-[#F4F4F6]">
            <tr>
              <th className="employees-table-th-styles rounded-l-[12px]">COMPANY NAME</th>
              <th className="employees-table-th-styles">USER NAME</th>
              <th className="employees-table-th-styles">EMAIL</th>
              <th className="employees-table-th-styles">LAST UPDATED</th>
              <th className="employees-table-th-styles rounded-r-[12px] ">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={index}>
                <td className="employees-table-tr-styles pl-2">{company.name}</td>
                <td className="employees-table-tr-styles pl-2">{company.user_name}</td>
                <td className="employees-table-tr-styles pl-2">{company.email}</td>
                <td className="employees-table-tr-styles pl-2">
                  {moment(company.updated_at).format("DD-MM-YYYY")}
                </td>
                <td className="">
                  <div className="flex">
                    <Link onClick={handleLinkClickWithLoading} href={`/admin/edit-company?id=${company.user_id}`}>
                      <button className="bg-[#F7F7F7] py-[6px] md:py-[9px] my-2 px-[16px] md:px-[24px] rounded-[50px] text-[14px] text-[#2D8AC5] md:leading-4 font-normal mr-2">Edit</button>
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
      )}
    </div>
  );
};

export default Companies_table;
