import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Accounts_table from './Accounts_table';

const Accounts_component = () => {

  const accounts = [
    { id:1,account_name: 'Facebook,whatsApp,EuroSMS',company_name: 'Company1', status: 'Enabled' },
    { id:2,account_name: 'Whatsapp',company_name: 'Company2', status: 'Not Enabled' },
    { id:3,account_name: 'None',company_name: 'Company3', status: 'Enabled' },
  
  ];
  return (
    <div className="px-6 pt-5 pb-3">
      <div className="flex justify-between">
      
        <div className="flex">
          
          <h1 className="text-[#343233] text-[18px] md:text-[24px] font-bold md:leading-7">Company Accounts</h1>
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
