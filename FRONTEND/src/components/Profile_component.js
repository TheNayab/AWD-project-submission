import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Profile_component = () => {
  return (
    <div className="px-6 pt-5 pb-3">
      <div className="flex justify-between">
     
        <div className="flex">
         
          <h1 className="text-[#343233] text-[18px] md:text-[24px] font-bold md:leading-7">My Profile</h1>
        </div>
        
        
      </div>
      {/* Add employee form */}
     
     <form className=" bg-white p-4 rounded-xl my-2 h-screen">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Name */}
          <div>
            <label htmlFor="name" className="add_employee_lables">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="off"
              placeholder="Enter contact name"
              className="add_employee_inputs"
            />
          </div>
          {/* Email */}
          <div>
            <label htmlFor="email" className="add_employee_lables">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder='name@mail.com'
              className="add_employee_inputs"
            />
          </div>
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="add_employee_lables">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              placeholder='Enter phone'
              className="add_employee_inputs"
            />
          </div>
          {/* Username */}
          <div>
            <label htmlFor="username" className="add_employee_lables">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              placeholder='Enter username'
              className="add_employee_inputs"
            />
          </div>
          {/* Set Password */}
          <div>
            <label htmlFor="password" className="add_employee_lables">Set Password</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder='Enter password here'
              className="add_employee_inputs"
            />
          </div>
          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="add_employee_lables">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder='Re-enter password here'
              className="add_employee_inputs"
            />
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex flex-row-reverse">
          <button
            type="submit"
            className=" w-full md:w-auto bg-[#2D8AC5] py-[9px] px-[24px] rounded-[50px] text-white font-normal text-[14px] leading-4 hover:bg-[#225e88] mt-5"
          >
            Submit
          </button>
        </div>
      </form>
    

      {/* Employee table */}
      <div>
        <div className="">
          {/* Your Employee_table component */}
        </div>
      </div>
    </div>
  );
};

export default Profile_component;
