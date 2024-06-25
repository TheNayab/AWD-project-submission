"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import axios from "axios";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';
import { getCompanyAccessToken } from "@/utils/authutils";
import { jwtDecode } from "jwt-decode";

const Profile_component = () => {

  

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
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
       
        setLoading(true);
        const { confirmPassword, ...requestData } = values;
        // Replace this with your actual API call to update employee details
        const token = getCompanyAccessToken();

        const decoded = jwtDecode(token);
        const companyId = decoded.user_id
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/company/edit-profile-of-company/${companyId}`,
          {
            // company_id: companyId,
            ...requestData,
          },{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { message } = response.data;
        toast.success(message || 'Profile updated successfully');
        setTimeout(() => {
          router.push('/company/profile');
        }, 3000);
      } catch (error) {
        console.error('Error updating company details:', error);
        toast.error(error.response?.data.error || 'Failed to update company details');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });



  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);

        const token = getCompanyAccessToken();
        const decoded = jwtDecode(token);
        const companyId = decoded.user_id
        // Fetch compny details using API endpoint
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/company/get-company-profile/${companyId}`,{

          headers: {
            Authorization: `Bearer ${token}`,
          },
          }
        );

        const  companyDetails  = response.data;
      
        // console.log(companyDetails)
        // Set the relevant data in the formik state
        formik.setValues({
          name: companyDetails.name || "",
          email: companyDetails.email || "",
          phone: companyDetails.phone || "",
          user_name: companyDetails.user_name || "",
          password:  "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error('Error fetching customer details:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchCompanyDetails();
  }, []);

  return (
    <div className="px-6 pt-5 pb-3">
      <div className="flex justify-between">
     
        <div className="flex">
         
          <h1 className="text-[#343233] text-[18px] md:text-[24px] font-bold md:leading-7">My Profile</h1>
        </div>
        
        
      </div>
      {/* Add employee form */}
     
      <form className=" bg-white p-4 rounded-xl my-2 h-screen" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
              placeholder="Enter company name"
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
              required={formik.values.password.length > 0}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && <div className="text-red-500">{formik.errors.confirmPassword}</div>}
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
             {/* Display loader while submitting the form */}
             {formik.isSubmitting && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ThreeDots type="Puff" color="#fff" height={50} width={50} />
        </div>
      )}
       {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ThreeDots type="Puff" color="#fff" height={50} width={50} />
        </div>
      )}
      <ToastContainer />
    

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
