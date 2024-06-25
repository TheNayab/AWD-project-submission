"use client"
import { useState, useEffect } from 'react';
import Companies_table from './Companies_table';
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';
import { getAdminAccessToken } from '@/utils/authutils';
import { usePathname } from "next/navigation";

const Company_component = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Get the token from localStorage
        const token = getAdminAccessToken();

        // Set loading to true while fetching data
        setLoading(true);

        // Make a GET request to your API endpoint
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/get-all-companies`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If the response is successful (status code 2xx), set the companies in state
        if (response.status >= 200 && response.status < 300) {
          setCompanies(response.data.companies);
        } else {
          // Handle errors
          console.error('Error fetching companies:', response.data.error);
          toast.error(error.response?.data.error || 'Failed to Get Records, Please ');
        }
      } catch (error) {
        console.error('Error in fetchCompanies:', error);
        toast.error(error.response?.data.error || 'Failed to edit company');
      } finally {
        // Set loading to false once data is fetched (whether successful or not)
        setLoading(false);
      }
    };

    // Call the fetchCompanies function when the component mounts
    fetchCompanies();
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
        <h1 className='text-[#343233] text-[18px] md:text-[24px] font-bold md:leading-7'>Companies</h1>
        <div>
          <Link onClick={handleLinkClickWithLoading} href="/admin/add-company" className='bg-[#2D8AC5] py-[6px] px-[16px] md:py-[9px] md:px-[24px] gap-1 rounded-[50px] text-white font-normal leading-4 text-[14px]'>+ New Company</Link>
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
        <Companies_table companies={companies} />
      </div>
    </div>
  );
};

export default Company_component;
