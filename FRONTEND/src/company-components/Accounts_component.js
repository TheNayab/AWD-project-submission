import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Accounts_table from './Accounts_table';

const Accounts_component = () => {

  const accounts = [
    { id:1,name: 'Facebook', status: 'Enabled', contact: '111-111-111' },
    { id:2,name: 'Whatsapp', status: 'Not Enabled', contact: '222-22-222' },
    { id:3,name: 'SMS', status: 'Enabled', contact: '222-22-222' },
  
  ];
  return (
    <div className="px-6 pt-5 pb-3">
      <div className="flex justify-between">
      
        <div className="flex">
          
          <h1 className="text-[#343233] text-[18px] md:text-[24px] font-bold md:leading-7">Accounts</h1>
        </div>
        
        
      </div>
      {/* Accounts table */}
      <div>
      <div className="bg-white p-4 rounded-xl my-2 h-screen overflow-x-auto">
      <Accounts_table  accounts={accounts} />
    </div>
   </div>
   
    
    </div>
  );
};

export default Accounts_component;
