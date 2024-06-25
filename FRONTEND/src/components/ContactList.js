"use client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const ContactList = ({
  contacts,
  selectedContact,
  handleContactClick,
  handleCheckboxChange,
  selectedChats,
}) => {
  const searchParams = useSearchParams();
  const myParam = searchParams.get("db");
  const [Allchats, setAllchats] = useState([]);
  const [AllMergedChats, setAllMergedChats] = useState([]);

  const getAllContacts = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/employee/get-all-chats?user_id=${myParam}&selected_employee_id=${myParam}`
      )
      .then((response) => {
        console.log("response of getall ", response.data);

        if (response.data && response.data.length > 0) {
          setAllchats(response.data);
        } else {
          console.error("Failed to fetch contacts:", response.data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
      });
  };

  const getAllMergedContacts = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/employee/get-all-merged-chats?user_id=${myParam}&selected_employee_id=${myParam}`
      )
      .then((response) => {
        console.log("response of merged", response.data);

        if (response.data && response.data.length > 0) {
          setAllMergedChats(response.data);
        } else {
          console.error("Failed to fetch contacts:", response.data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
      });
  };

  useEffect(() => {
    getAllContacts();
    getAllMergedContacts();
  }, []);

  return (
    <div className="w-screen md:w-[317px] border-r-[1px] h-screen overflow-y-auto omni-scroll-bar pr-4">
      <input
        type="search"
        placeholder="Search Contacts"
        name="search"
        id="search"
        className="add_employee_inputs"
      />
      <div className="mt-5">
        <ul>
          {AllMergedChats
            ? AllMergedChats.map((contact) => (
                <li
                  key={contact.id}
                  className={`mb-2 py-[4px] px-[8px] gap-3 ${
                    selectedContact?.id === contact.id
                      ? "bg-[#DBF3FF]"
                      : "bg-white"
                  } rounded-xl`}
                  onClick={() => handleContactClick(contact)}
                >
                  <div className="flex cursor-pointer">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        className="rounded-full"
                        onClick={(e) => handleCheckboxChange(contact.id, e)}
                      >
                        {selectedChats.some(
                          (chat) => chat.contactId === contact.id
                        ) ? (
                          <Image
                            src="/assets/checkbox-checked.svg"
                            width={24}
                            height={24}
                            alt="profile image"
                          />
                        ) : (
                          <Image
                            src="/assets/checkbox-unchecked.svg"
                            width={24}
                            height={24}
                            alt="profile image"
                          />
                        )}
                      </button>
                      <div className="rounded-full">
                        <Image
                          src={contact.profile_img || "/assets/chat-dp.svg"}
                          width={50}
                          height={50}
                          alt="profile image"
                        />
                      </div>
                    </div>
                    <div className="ml-2 w-full">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">
                          {contact?.merged_name?.split(",")[0]}
                        </span>
                        {/* <Image src="/assets/webchat-logo.svg" width={16} height={16} alt="chat logo" /> */}
                        {/* Render chat logo based on preferred platform */}
                        {contact.preferred_platform == "webchat" && (
                          <Image
                            src="/assets/webchat-logo.svg"
                            width={16}
                            height={16}
                            alt="chat logo"
                          />
                        )}
                        {contact.preferred_platform === "facebook" && (
                          <Image
                            src="/assets/facebook-logo.svg"
                            width={16}
                            height={16}
                            alt="chat logo"
                          />
                        )}
                        {contact.preferred_platform === "sms" && (
                          <Image
                            src="/assets/eurosms-logo.svg"
                            width={16}
                            height={16}
                            alt="chat logo"
                          />
                        )}
                        {contact.preferred_platform === "whatsApp" && (
                          <Image
                            src="/assets/whatsapp-logo.svg"
                            width={16}
                            height={16}
                            alt="chat logo"
                          />
                        )}
                      </div>
                      <h1 className="text-[#343233] text-[14px] leading-4 font-normal">
                        {/* {messages && messages.length > 0
                          ? truncateMessage(
                              messages[messages.length - 1].message
                            )
                          : truncateMessage(latestMessage)} */}
                        Have you done my job? Where...
                      </h1>
                    </div>
                  </div>
                </li>
              ))
            : ""}
        </ul>
        <ul>
          {Allchats &&
            Allchats?.map((contact) => (
              <li
                key={contact.id}
                className={`mb-2 py-[4px] px-[8px] gap-3  ${
                  selectedContact && selectedContact.id === contact.id
                    ? "bg-[#DBF3FF] rounded-xl"
                    : ""
                }`}
                onClick={() => handleContactClick(contact)}
              >
                <div className="flex cursor-pointer">
                  <div className="flex justify-center items-center gap-2">
                    {/* checkbox */}
                    <button
                      className="rounded-full"
                      onClick={() => handleCheckboxChange(contact.id)}
                    >
                      {selectedChats.includes(contact.id) ? (
                        <Image
                          src="/assets/checkbox-checked.svg"
                          width={24}
                          height={24}
                          alt="profile image"
                        />
                      ) : (
                        <Image
                          src="/assets/checkbox-unchecked.svg"
                          width={24}
                          height={24}
                          alt="profile image"
                        />
                      )}
                    </button>
                    {/* checkbox end */}
                    <div className="rounded-full">
                      <Image
                        src="/assets/chat-dp.svg"
                        width={50}
                        height={50}
                        alt="profile image"
                      />
                    </div>
                  </div>
                  <div className="ml-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{contact.name}</span>
                      {contact.preferred_platform == "webchat" && (
                        <Image
                          src="/assets/webchat-logo.svg"
                          width={16}
                          height={16}
                          alt="chat logo"
                        />
                      )}
                      {contact.preferred_platform === "facebook" && (
                        <Image
                          src="/assets/facebook-logo.svg"
                          width={16}
                          height={16}
                          alt="chat logo"
                        />
                      )}
                      {contact.preferred_platform === "sms" && (
                        <Image
                          src="/assets/eurosms-logo.svg"
                          width={16}
                          height={16}
                          alt="chat logo"
                        />
                      )}
                      {contact.preferred_platform === "whatsApp" && (
                        <Image
                          src="/assets/whatsapp-logo.svg"
                          width={16}
                          height={16}
                          alt="chat logo"
                        />
                      )}
                    </div>
                    <h1 className="text-[#343233] text-[14px] leading-4 font-normal">
                      Have you done my job? Where...
                    </h1>
                  </div>
                </div>
              </li>
            ))}
        </ul>
        {AllMergedChats.length == 0 && Allchats.length == 0 ? (
          <div className=" flex justify-center items-center">
            <b>No chat found</b>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ContactList;
