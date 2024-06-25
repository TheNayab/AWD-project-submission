"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Accounts_table = ({ accounts }) => {
  const [accountStatus, setAccountStatus] = useState(accounts.map(() => true));
  const [modalOpen, setModalOpen] = useState(false);
  const [Data, setData] = useState(null);
  const [inputvalue, setinputvalue] = useState("");
  const [fbname, setfbname] = useState("");

  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleSwitchClick = (index) => {
    setAccountStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index] = !newStatus[index];
      return newStatus;
    });
  };

  const handleConnectClick = (account) => {
    setSelectedAccount(account);
    setModalOpen(true);
  };

  const handleCloseModal = async (name) => {
    try {
      const token = Cookies.get("company_access_token");
      if (token) {
        const decodedToken = jwtDecode(token);
        var companyId = decodedToken.user_id;
      }
      console.log("edrjhun " + name);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/company/connected-chats/${companyId}`,
        {
          wshatsappconnection: JSON.stringify(inputvalue),
          nameofchat: name,
        }
      );
      console.log("aya k nai" + response.data.message);
      if (response.data.success === true) {
        toast.success("Chat connect successfully");
        getConnections();
      }
    } catch (err) {
      console.log(err);
    }

    setModalOpen(false);
    setSelectedAccount(null);
  };

  const token = Cookies.get("company_access_token");
  if (token) {
    const decodedToken = jwtDecode(token);
    var companyId = decodedToken.user_id;
  }

  const getConnections = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/company/get-connected-chats/${companyId}`
    );
    setData(response.data);
    console.log("response data " + JSON.stringify(response.data));
  };
  useEffect(() => {
    getConnections();
  }, []);

  const handleChange = (e) => {
    setinputvalue(e.target.value);
  };
  const disconnect = async (name) => {
    try {
      const token = Cookies.get("company_access_token");
      if (token) {
        const decodedToken = jwtDecode(token);
        var companyId = decodedToken.user_id;
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/company/connected-chats/${companyId}`,
        {
          wshatsappconnection: 0,
          nameofchat: name,
        }
      );
      console.log("aya k nai" + response.data.message);
      if (response.data.success === true) {
        getConnections();
        toast.success("Chat disconnected successfully");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <table className="min-w-full">
        <thead className="bg-[#F4F4F6]">
          <tr>
            <th className="employees-table-th-styles rounded-l-[12px]">
              ACCOUNTS
            </th>
            <th className="employees-table-th-styles">STATUS</th>
            <th className="employees-table-th-styles">ENABLE/DISABLE</th>
            <th className="employees-table-th-styles rounded-r-[12px]">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="employees-table-tr-styles pl-2">Facebook</td>
            <td className="employees-table-tr-styles pl-2">
              {accountStatus[0] ? "Enabled" : "Not Enabled"}
            </td>
            <td className="employees-table-tr-styles pl-2">
              <div
                onClick={() => handleSwitchClick(0)}
                className="cursor-pointer"
              >
                <Image
                  src={
                    accountStatus[0]
                      ? "/assets/switch-enabled.svg"
                      : "/assets/switch-disabled.svg"
                  }
                  width={24}
                  height={24}
                  alt={`button enable or Disable for Facebook`}
                />
              </div>
            </td>
            <td className="">
              <div className="flex">
                <button
                  onClick={() => handleConnectClick("Facebook")}
                  className="bg-[#F7F7F7] py-[6px] md:py-[9px] my-2 px-[16px] md:px-[24px] rounded-[50px] text-[14px] text-[#DA1539] md:leading-4 font-normal"
                >
                  Connect
                </button>
                {Data?.checkEmployeeResults[0]?.facebookconnect != 0 ? (
                  <button
                    onClick={() => disconnect("Facebook")}
                    className=" bg-[#F7F7F7] py-[6px] md:py-[9px] my-2 px-[16px] md:px-[24px] rounded-[50px] text-[14px] text-[#DA1539] md:leading-4 font-normal"
                  >
                    Disconnect
                  </button>
                ) : null}
              </div>
            </td>
          </tr>
          <tr>
            <td className="employees-table-tr-styles pl-2">Whatsapp</td>
            <td className="employees-table-tr-styles pl-2">
              {accountStatus[1] ? "Enabled" : "Not Enabled"}
            </td>
            <td className="employees-table-tr-styles pl-2">
              <div
                onClick={() => handleSwitchClick(1)}
                className="cursor-pointer"
              >
                <Image
                  src={
                    accountStatus[1]
                      ? "/assets/switch-enabled.svg"
                      : "/assets/switch-disabled.svg"
                  }
                  width={24}
                  height={24}
                  alt={`button enable or Disable for Whatsapp`}
                />
              </div>
            </td>
            <td className="">
              <div className="flex">
                <button
                  onClick={() => handleConnectClick("Whatsapp")}
                  className="bg-[#F7F7F7] py-[6px] md:py-[9px] my-2 px-[16px] md:px-[24px] rounded-[50px] text-[14px] text-[#DA1539] md:leading-4 font-normal"
                >
                  Connect
                </button>
                {Data?.checkEmployeeResults[0]?.whatsappconnect != 0 ? (
                  <button
                    onClick={() => disconnect("Whatsapp")}
                    className=" bg-[#F7F7F7] py-[6px] md:py-[9px] my-2 px-[16px] md:px-[24px] rounded-[50px] text-[14px] text-[#DA1539] md:leading-4 font-normal"
                  >
                    Disconnect
                  </button>
                ) : null}
              </div>
            </td>
          </tr>
          <tr>
            <td className="employees-table-tr-styles pl-2">SMS</td>
            <td className="employees-table-tr-styles pl-2">
              {accountStatus[3] ? "Enabled" : "Not Enabled"}
            </td>
            <td className="employees-table-tr-styles pl-2">
              <div
                onClick={() => handleSwitchClick(3)}
                className="cursor-pointer"
              >
                <Image
                  src={
                    accountStatus[3]
                      ? "/assets/switch-enabled.svg"
                      : "/assets/switch-disabled.svg"
                  }
                  width={24}
                  height={24}
                  alt={`button enable or Disable for Facebook`}
                />
              </div>
            </td>
            <td className="">
              <div className="flex">
                <button
                  onClick={() => handleConnectClick("SMS")}
                  className="bg-[#F7F7F7] py-[6px] md:py-[9px] my-2 px-[16px] md:px-[24px] rounded-[50px] text-[14px] text-[#DA1539] md:leading-4 font-normal"
                >
                  Connect
                </button>
                {Data?.checkEmployeeResults[0]?.smsconnect != 0 ? (
                  <button
                    onClick={() => disconnect("SMS")}
                    className=" bg-[#F7F7F7] py-[6px] md:py-[9px] my-2 px-[16px] md:px-[24px] rounded-[50px] text-[14px] text-[#DA1539] md:leading-4 font-normal"
                  >
                    Disconnect
                  </button>
                ) : null}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div
            className=" bg-white"
            style={{ width: "30vw", height: "30vh", borderRadius: "10px" }}
          >
            <h2 className="text-xl font-bold mb-4 flex justify-center mt-9">
              Connect {selectedAccount}
            </h2>
            {selectedAccount === "Facebook" && (
              <div className="w-full flex justify-center">
                <input
                  placeholder="Enter Facebook ID"
                  className="border p-2 rounded mb-4 "
                  style={{ width: "80%" }}
                  value={inputvalue}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            {selectedAccount === "Whatsapp" && (
              <div className="w-full flex justify-center">
                <input
                  type="number"
                  placeholder="Enter Whatsapp Number"
                  className="border p-2 rounded mb-4 "
                  style={{ width: "80%" }}
                  value={inputvalue}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            {selectedAccount === "SMS" && (
              <div className="w-full flex justify-center">
                <input
                  placeholder="Enter Phone Number"
                  className="border p-2 rounded mb-4 "
                  style={{ width: "80%" }}
                  value={inputvalue}
                  onChange={handleChange}
                  type="number"
                  required
                />
              </div>
            )}
            {/* <br /> */}
            <div className="w-full flex justify-center">
              <button
                onClick={() => handleCloseModal(selectedAccount)}
                className="bg-black text-white px-4 py-2 "
                style={{ borderRadius: "5px" }}
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default Accounts_table;
