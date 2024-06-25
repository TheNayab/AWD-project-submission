import React from 'react'
import Contacts_table from './Contacts_table';
import Link from 'next/link'

const Contacts_component = () => {

  const contacts = [
    { name: 'contact', email: 'contact@mail.com', contact: '111-111-112' },
    { name: 'Jane Doe', email: 'jane@example.com', contact: '222-22-222' },
  
  ];

  return (
    <div className='px-6 pt-5 pb-3'>
   <div className='flex justify-between'>
  
   <h1 className='text-[#343233] text-[18px] md:text-[24px] font-bold md:leading-7'>Contacts</h1>
  
      <div>
        <Link href="/add-contacts" className='bg-[#2D8AC5] py-[6px] px-[16px] md:py-[9px] md:px-[24px] gap-1 rounded-[50px] text-white font-normal leading-4 text-[14px]'>+ New Contact</Link>
      </div>
   </div>
   {/* Table */}

   <div>
      <div className="bg-white p-4 rounded-xl my-2 h-screen overflow-x-auto">
      <Contacts_table  contacts={contacts} />
    </div>
   </div>
    </div>
  )
}

export default Contacts_component