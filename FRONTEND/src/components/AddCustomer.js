"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFormik } from 'formik';
import { useRouter } from "next/navigation";
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getAdminAccessToken } from "@/utils/authutils";

const AddCustomer = () => {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch companies from the API
    const fetchCompanies = async () => {
      try {
        // Get the token from localStorage
        const token = getAdminAccessToken();
        const response = await axios.get('http://localhost:7000/api/v1/admin/get-all-companies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanies(response.data.companies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setDropdownOpen(false);
  };

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
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Ensure a company is selected
        if (!selectedCompany) {
          toast.error('Please select a company');
          return;
        }

        // Extract company_id from selectedCompany
        const company_id = selectedCompany.user_id;

        // API call to add customers
        const token = getAdminAccessToken();
        const { company,confirmPassword, ...requestData } = values;
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/add-customer-by-admin`,
          { ...requestData, company_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Display success message
        toast.success(response.data.message);
        setTimeout(() => {
          router.push('/admin/customers');
        }, 3000);

        // Reset form
        resetForm();
        setSelectedCompany(null); // Clear selected company after submission
      } catch (error) {
        // Display error message
        toast.error(error.response?.data.error || 'An error occurred');
      } finally {
        // Enable the submit button
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="px-6 pt-5 pb-3">
      <div className="flex justify-between">
        <Link href="/admin/customers">
          <div className="flex">
            <Image src="/assets/arrow-left.svg" height={24} width={24} alt="back arrow" className="mr-4" />
            <h1 className="text-[#343233] text-[24px] font-bold leading-7">New Customer</h1>
          </div>
        </Link>
      </div>

      {/* Add employee form */}
      <form onSubmit={formik.handleSubmit} className="bg-white p-4 rounded-xl my-2 h-screen">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Company */}
          <div>
            <label htmlFor="company" className="add_employee_labels">
              Company
            </label>
            <div className="relative">
              <div
                className={`add_employee_inputs ${selectedCompany ? '' : 'text-[#9f9a9c]'}`}
                onClick={handleDropdownToggle}
              >
                {selectedCompany ? selectedCompany.name : 'Select'}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Image src="/assets/dropdown-arrow.svg" height={16} width={16} alt="dropdown arrow" />
                </div>
              </div>
              {isDropdownOpen && (
                <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg">
                  {companies.map((company) => (
                    <div
                      key={company.user_id}
                      onClick={() => {
                        handleCompanySelect(company);
                        formik.setFieldValue('company', company.user_name);
                      }}
                      className="py-2 px-4 cursor-pointer hover:bg-gray-200"
                    >
                      {company.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {formik.touched.company && formik.errors.company && (
              <div className="text-red-500">{formik.errors.company}</div>
            )}
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
              User Name
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
          {/* Set Password */}
          <div>
            <label htmlFor="password" className="add_employee_lables">
              Set Password
            </label>
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
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500">{formik.errors.password}</div>
            )}
          </div>
          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="add_employee_lables">
              Confirm Password
            </label>
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
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="text-red-500">{formik.errors.confirmPassword}</div>
            )}
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex flex-row-reverse">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full md:w-auto bg-[#2D8AC5] py-[9px] px-[24px] rounded-[50px] text-white font-normal text-[14px] leading-4 hover:bg-[#225e88] mt-5"
          >
            {formik.isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      {/* Employee table */}
      <div>
        <div className="">
          {/* Your Employee_table component */}
        </div>
      </div>

      {/* Toast Container for Notifications */}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default AddCustomer;
