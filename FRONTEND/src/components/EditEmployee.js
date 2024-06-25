"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams,useRouter } from 'next/navigation'
import axios from "axios";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';
import { getAdminAccessToken } from "@/utils/authutils";

const EditEmployee = () => {

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState('');
  const [companies, setCompanies] = useState([]); // Add this state to store companies

  const searchParams = useSearchParams();
  const router = useRouter();
  
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      user_name: "",
      password: "",
      confirmPassword: "",
      
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      phone: Yup.string().required('Required'),
      user_name: Yup.string().required('Required'),
      password: Yup.string(),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const companyId = searchParams.get('c_id');
        const employeeId = searchParams.get('e_id');
        
        const { confirmPassword, ...requestData } = values;
        // Replace this with your actual API call to update employee details
        const token = getAdminAccessToken();
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/edit-employee-by-admin/${employeeId}`,
          {
            company_id: companyId,
            ...requestData,
          },{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { message } = response.data;
        toast.success(message || 'Employee updated successfully');
        setTimeout(() => {
          router.push('/admin/employees');
        }, 3000);
      } catch (error) {
        console.error('Error updating employee details:', error);
        toast.error(error.response?.data.error || 'Failed to update employee');
      } finally {
        setSubmitting(false);
      }
    },
  });



  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const companyId = searchParams.get('c_id');
        const employeeId = searchParams.get('e_id');
        const companyNameFromParams = searchParams.get('c_name');

        setSelectedCompanyName(companyNameFromParams);
        const token = getAdminAccessToken();
        // Fetch employee details using your API endpoint
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/get-single-employee-by-admin/${companyId}/${employeeId}`,{

          headers: {
            Authorization: `Bearer ${token}`,
          },
          }
        );

        const { employeeDetails } = response.data;
        setDropdownOpen(true); // Set dropdown open to show the selected company

        // Set the relevant data in the formik state
        formik.setValues({
          name: employeeDetails.name || "",
          email: employeeDetails.email || "",
          phone: employeeDetails.phone || "",
          user_name: employeeDetails.user_name || "",
          password:  "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchEmployeeDetails();
  }, [searchParams]);

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="px-6 pt-5 pb-3">
      <div className="flex justify-between">
        <Link href="/admin/employees">
          <div className="flex">
            <Image src="/assets/arrow-left.svg" height={24} width={24} alt="back arrow" className="mr-4" />
            <h1 className="text-[#343233] text-[24px] font-bold leading-7">New Employee</h1>
          </div>
        </Link>
      </div>

      {/* Edit employee form */}
      <form className="bg-white p-4 rounded-xl my-2 h-screen" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Company Dropdown */}
          <div>
            <div className="-mt-[3px]">
              <label htmlFor="company" className="add_employee_labels">
                Company
              </label>
            </div>
            <div className="relative">
              <div
                className={`add_employee_inputs ${selectedCompanyName ? '' : 'text-[#9f9a9c]'}`}
                onClick={handleDropdownToggle}
              >
                {selectedCompanyName || 'Select'}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Image src="/assets/dropdown-arrow.svg" height={16} width={16} alt="dropdown arrow" />
                </div>
              </div>
              {isDropdownOpen && companies.length > 0 && (
                <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg">
                <div>
                 
                </div>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="add_employee_lables">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="off"
              placeholder="Enter employee name"
              className="add_employee_inputs"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500">{formik.errors.name}</div>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="add_employee_lables">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder="name@mail.com"
              className="add_employee_inputs"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500">{formik.errors.email}</div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="add_employee_lables">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              placeholder="Enter phone"
              className="add_employee_inputs"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500">{formik.errors.phone}</div>
            )}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="add_employee_lables">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="user_name"
              autoComplete="username"
              placeholder="Enter username"
              className="add_employee_inputs"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.user_name}
            />
            {formik.touched.user_name && formik.errors.user_name && (
              <div className="text-red-500">{formik.errors.user_name}</div>
            )}
          </div>

          <div>
            <label htmlFor="password" className="add_employee_lables">Set Password</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="Enter password here"
              className="add_employee_inputs"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && <div className="text-red-500">{formik.errors.password}</div>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="add_employee_lables">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter password here"
              className="add_employee_inputs"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && <div className="text-red-500">{formik.errors.confirmPassword}</div>}
          </div>
        </div>
         {/* Submit Button */}
         <div className="flex flex-row-reverse">
            <button
              type="submit"
              className="w-full md:w-auto bg-[#2D8AC5] py-[9px] px-[24px] rounded-[50px] text-white font-normal text-[14px] leading-4 hover:bg-[#225e88] mt-5"
            >
              Submit
            </button>
          </div>
      </form>

      {/* Display loader while submitting the form */}
      {formik.isSubmitting && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ThreeDots type="Puff" color="#fff" height={50} width={50} />
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default EditEmployee;
