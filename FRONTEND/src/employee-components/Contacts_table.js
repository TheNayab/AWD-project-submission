import Link from "next/link";

    // components/EmployeeTable.js
    const Contacts_table = ({ contacts }) => {
        return (
        
            <table className="min-w-full">
            <thead className="bg-[#F4F4F6]">
            <tr>
                <th className="employees-table-th-styles rounded-l-[12px]">CONTACT NAME</th>
                <th className="employees-table-th-styles">EMAIL</th>
                <th className="employees-table-th-styles">CONTACT</th>
                <th className="employees-table-th-styles rounded-r-[12px] ">ACTIONS</th>
            </tr>
            </thead>
            <tbody>
            {contacts.map((contact, index) => (
                <tr key={index}>
                <td className="employees-table-tr-styles pl-2">{contact.name}</td>
                <td className="employees-table-tr-styles pl-2">{contact.email}</td>
                <td className="employees-table-tr-styles pl-2">{contact.contact}</td>
                <td className="">
                    
                   <div className="flex">
                   <Link href="/edit-contacts">
                   <button className="bg-[#F7F7F7] py-[6px] md:py-[9px] my-2 px-[16px] md:px-[24px] rounded-[50px] text-[14px] text-[#2D8AC5] md:leading-4 font-normal mr-2">Edit</button>
                   </Link>
                   <Link href="">
                   <button className="bg-[#F7F7F7] py-[6px] md:py-[9px] my-2 px-[16px] md:px-[24px] rounded-[50px] text-[14px] text-[#2D8AC5] md:leading-4 font-normal">Chat</button>
                   </Link>
                   </div>
                    
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        
        );
    };
    
    export default Contacts_table;
    