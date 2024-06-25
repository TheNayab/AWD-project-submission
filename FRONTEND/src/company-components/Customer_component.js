"use client"
import React, { useState, useEffect } from 'react';
import Customers_table from './Customers_table';
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';
import { getCompanyAccessToken } from '@/utils/authutils';
import { jwtDecode } from "jwt-decode";
import { BASE_API_URL } from '@/config/apiConfig';
import { usePathname } from "next/navigation";

const Customer_component = () => {
  const [companyId, setCompanyId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    const authToken = localStorage.getItem('company_access_token');
    try {
      // Decode the JWT token to access its payload
      const decodedToken = jwtDecode(authToken);
      // Retrieve the company ID from the decoded token's payload
      const companyIdFromToken = decodedToken.user_id;

      // Set the company ID in the component state
      setCompanyId(companyIdFromToken);

      // Use an asynchronous function to fetch customers
      const fetchCustomers = async () => {
        try {
          // Get the token from localStorage
          const token = getCompanyAccessToken();

          // Set loading to true while fetching data
          setLoading(true);

          // Make a GET request to your API endpoint for customers
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/company/get-all-customers/${companyIdFromToken}`, {
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
            toast.error(response?.data.error || 'Failed to Get Customer Records');
          }
        } catch (error) {
          console.error('Error in fetchCustomers:', error);
          toast.error(error?.response?.data.error || 'Failed to fetch customers');
        } finally {
          // Set loading to false once data is fetched (whether successful or not)
          setLoading(false);
        }
      };

      // Call the fetchCustomers function when the component mounts
      fetchCustomers();
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
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
          <Link onClick={handleLinkClickWithLoading} href="/company/add-customers" className='bg-[#2D8AC5] py-[6px] px-[16px] md:py-[9px] md:px-[24px] gap-1 rounded-[50px] text-white font-normal leading-4 text-[14px]'>+ New Customer</Link>
        </div>
      </div>

      {/* Display loader while data is being fetched */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ThreeDots type="Puff" color="#fff" height={50} width={50} />
        </div>
      )}

      {/* Table */}
      <div className={`bg-white p-4 rounded-xl my-2 h-screen overflow-x-auto ${loading ? 'opacity-50' : ''}`}>
        <Customers_table customers={customers} />
      </div>
    </div>
  );
};

export default Customer_component;
