"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import { getAdminAccessToken } from '@/utils/authutils';
import Customers_table from './Customers_table';
import { usePathname } from "next/navigation";

const Customers_component = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Get the token from localStorage
        const token = getAdminAccessToken();

        // Set loading to true while fetching data
        setLoading(true);

        // Make a GET request to your API endpoint
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/get-all-customers-of-all-companies`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If the response is successful (status code 2xx), set the customers in state
        if (response.status >= 200 && response.status < 300) {
          setCustomers(response.data.customers);
        } else {
          // Handle errors
          console.error('Error fetching customers:', response.data.error);
        }
      } catch (error) {
        console.error('Error in fetchCustomers:', error);
      } finally {
        // Set loading to false once data is fetched (whether successful or not)
        setLoading(false);
      }
    };

    // Call the fetchCustomers function when the component mounts
    fetchCustomers();
  }, []);

  const handleLinkClickWithLoading = () => {
    setLoading(true); // Set loading to true when link is clicked
    // handleLinkClick(); // Call your existing handleLinkClick function
  };

  useEffect(() => {
    setLoading(false); // Set loading to false after the component has rendered
  }, [pathname]);

  return (
    <div className='px-6 pt-5 pb-3'>
      <div className='flex justify-between'>
        <h1 className='text-[#343233] text-[18px] md:text-[24px] font-bold md:leading-7'>Customers</h1>
        <div>
          <Link onClick={handleLinkClickWithLoading} href="/admin/add-customers" className='bg-[#2D8AC5] py-[6px] px-[16px] md:py-[9px] md:px-[24px] gap-1 rounded-[50px] text-white font-normal leading-4 text-[14px]'>
            + New Customer
          </Link>
        </div>
      </div>

      {/* Display loader while data is being fetched */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ThreeDots type="Puff" color="#fff" height={50} width={50} />
        </div>
      )}

      {/* Table */}
      <div>
        <div className={`bg-white p-4 rounded-xl my-2 h-screen overflow-x-auto ${loading ? 'opacity-50' : ''}`}>
          <Customers_table customers={customers} />
        </div>
      </div>
    </div>
  );
};

export default Customers_component;
