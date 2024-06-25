"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

const Accounts_table = () => {
  // const [accountStatus, setAccountStatus] = useState(accounts.map(() => true));
  const [accounts, setaccounts] = useState([]);
  const handleSwitchClick = (index) => {
    setAccountStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index] = !newStatus[index];
      return newStatus;
    });
  };

  const getAllConnections = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/getconnections`
      );
      if (response.status == 200) {
        console.log(response.data.chats);
        setaccounts(response.data.chats);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllConnections();
  }, []);

  return (
    <table className="min-w-full">
      <thead className="bg-[#F4F4F6]">
        <tr>
          <th className="employees-table-th-styles rounded-l-[12px]">
            COMPANY
          </th>
          <th className="employees-table-th-styles">CONNECTED ACCOUNTS</th>
          <th className="employees-table-th-styles rounded-r-[12px]">
            ACTIONS
          </th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account, index) => (
          <tr key={index}>
            <td className="employees-table-tr-styles pl-2">
              {account.user_name}
            </td>
            <td className="employees-table-tr-styles pl-2">
              {account.whatsappconnect && account?.whatsappconnect != 0
                ? "Whatsapp "
                : null}
              {account.facebookconnect && account?.facebookconnect != 0
                ? "Facebook "
                : null}
              {account.smsconnect && account?.smsconnect != 0 ? "SMS " : null}

              {!account.smsconnect &&
              !account.facebookconnect &&
              !account.whatsappconnect
                ? " No account connected"
                : null}
            </td>
            <td className="">
              <div className="flex items-center gap-3">
                <Link href="">
                  <button className="bg-[#F7F7F7] py-[6px] md:py-[9px] my-2 px-[16px] md:px-[24px] rounded-[50px] capitalize text-[14px] text-[#2D8AC5] md:leading-4 font-normal">
                    view customer
                  </button>
                </Link>
                {account.facebookconnect && account?.facebookconnect != 0 ? (
                  <Link href={`${account.facebookconnect}`} target="blank">
                    <button className="bg-[#F7F7F7] py-[6px] md:py-[9px] my-2 px-[16px] md:px-[24px] rounded-[50px] capitalize text-[14px] text-[#2D8AC5] md:leading-4 font-normal">
                      visit facebook page
                    </button>
                  </Link>
                ) : null}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Accounts_table;
