  "use client"
  import React from 'react';
  import Link from 'next/link';
  import Image from 'next/image';
  import { useRouter } from "next/navigation";
  import { useFormik } from 'formik';
  import * as Yup from 'yup';
  import axios from 'axios';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import { ThreeDots } from 'react-loader-spinner';
  import { getAdminAccessToken } from '@/utils/authutils';

  const AddCompany = () => {
    const router = useRouter();

    const formik = useFormik({
      initialValues: {
        name: '',
        email: '',
        phone: '',
        user_name: '',
        password: '',
        confirmPassword: '',
      },
      validationSchema: Yup.object({
        name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        phone: Yup.string().required('Required'),
        user_name: Yup.string().required('Required'),
        password: Yup.string().required('Required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required'),
      }),
      onSubmit: async (values, { setSubmitting }) => {
        
        try {

          // Exclude confirmPassword from the data sent to the API
          const { confirmPassword, ...requestData } = values;
          const token = getAdminAccessToken();
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/add-company`, requestData,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const { message, company_id } = response.data;

          console.log(response.data)

          toast.success(message || "Company added Sucessully");
          setTimeout(() => {
            router.push('/admin/companies');
          }, 3000);
        } catch (error) {
          console.error('Error adding company:', error);
          toast.error(error.response.data.error);
        } finally {
          setSubmitting(false);
        }
      },
    });

    return (
      <div className="px-6 pt-5 pb-3">
        <div className="flex justify-between">
        <Link href="/admin/companies">
          <div className="flex">
            <Image src="/assets/arrow-left.svg" height={24} width={24} alt="back arrow" className="mr-4" />
            <h1 className="text-[#343233] text-[24px] font-bold leading-7">New Company</h1>
          </div>
          </Link>
          
        </div>
        {/* Add employee form */}
      
      <form className=" bg-white p-4 rounded-xl my-2 h-screen" onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Name */}
            <div>
              <label htmlFor="name" className="add_employee_lables">Name</label>
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
              {formik.touched.name && formik.errors.name && <div className="text-red-500">{formik.errors.name}</div>}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && <div className="text-red-500">{formik.errors.email}</div>}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              {formik.touched.phone && formik.errors.phone && <div className="text-red-500">{formik.errors.phone}</div>}
            </div>
            {/* Username */}
            <div>
              <label htmlFor="username" className="add_employee_lables">Username</label>
              <input
                type="text"
                id="username"
                name="user_name"
                autoComplete="username"
                placeholder='Enter username'
                className="add_employee_inputs"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.user_name}
              />
              {formik.touched.user_name && formik.errors.user_name && <div className="text-red-500">{formik.errors.user_name}</div>}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && <div className="text-red-500">{formik.errors.password}</div>}
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
              className=" w-full md:w-auto bg-[#2D8AC5] py-[9px] px-[24px] rounded-[50px] text-white font-normal text-[14px] leading-4 hover:bg-[#225e88] mt-5"
            >
              Submit
            </button>
          </div>
        </form>
      {/* Display loader while submitting the form */}
      {formik.isSubmitting && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <ThreeDots type="Puff" color="#fff"  height={50} width={50} />
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

  export default AddCompany;
