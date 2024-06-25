"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { getAdminAccessToken } from "@/utils/authutils";

// components/EmployeeTable.js

const Chats_table = () => {
  const formatDate = (isoString) => {
    return format(new Date(isoString), "MMMM d, yyyy HH:mm");
  };

  const [chats, setchats] = useState([]);

  const getAllConnections = async () => {
    try {
      const token = getAdminAccessToken();

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/get-all-companies`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        setchats(response.data.companies);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllConnections();
  }, []);

  return (
    <div className="px-6 pt-5 pb-3">
      <h1 className="text-[#343233] text-[18px] md:text-[24px] font-bold md:leading-7 mb-4">
        Text Chats
      </h1>
      <div className="bg-white p-4 rounded-xl my-2 h-screen overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#F4F4F6]">
            <tr>
              <th className="employees-table-th-styles rounded-l-[12px]">
                COMPANY
              </th>
              <th className="employees-table-th-styles">CUSTOMER NUMBER</th>
              <th className="employees-table-th-styles">FIRST CHAT ON</th>
              <th className="employees-table-th-styles rounded-r-[12px] ">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {chats.map((chat, index) => (
              <tr key={index}>
                <td className="employees-table-tr-styles pl-2">
                  {chat.user_name}
                </td>
                <td className="employees-table-tr-styles pl-2">{chat.phone}</td>
                <td className="employees-table-tr-styles pl-2">
                  {formatDate(chat.created_at)}
                </td>

                <td className="">
                  <div className="flex">
                    <Link
                      href={`/admin/chats?db=${chat.user_id}&companyname=${chat.name}`}
                    >
                      <button className="bg-[#F7F7F7] py-[6px] md:py-[9px] my-2 px-[16px] md:px-[24px] rounded-[50px] text-[14px] text-[#2D8AC5] md:leading-4 font-normal mr-2">
                        View Chats
                      </button>
                    </Link>
                    {/* <Link href="">
                   <button className="bg-[#F7F7F7] py-[6px] md:py-[9px] my-2 px-[16px] md:px-[24px] rounded-[50px] text-[14px] text-[#2D8AC5] md:leading-4 font-normal">Chat</button>
                   </Link> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Chats_table;
