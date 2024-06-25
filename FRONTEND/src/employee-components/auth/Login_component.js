"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import loginPageimage from "/public/assets/login-page-image.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import Link from "next/link";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import moment from "moment";
import io from "socket.io-client"; // Import Socket.IO client library
import Cookies from "js-cookie";
import ChatHeader from "../ChatHeader";
import { BASE_API_URL } from "../../config/apiConfig";

const Login_component = () => {
  const router = useRouter();
  const initialValues = {
    company_id: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    company_id: Yup.number().required("Company is required"),
    email: Yup.string().required("User Name is required"),
    password: Yup.string().required("Password is required"),
  });

  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // Fetch companies data when the component mounts
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/employee/get-all-companies-names`
        );

        if (response.status === 200) {
          // Update the state with the fetched companies data
          setCompanies(response.data);
        } else {
          console.error("Error fetching companies:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  // useEffect(() => {
  //   // Check if user is already authenticated
  //   const adminAccessToken = localStorage.getItem('admin_access_token');
  //   if (adminAccessToken) {
  //     // If authenticated, redirect to the dashboard or main application screen
  //     router.push('/admin/companies');
  //   }
  // }, []);
  // let local = localStorage.getItem("employee_access_token");
  let cookie = Cookies.get("employee_access_token");
  useEffect(() => {
    // console.log(local);
    if ( cookie) {
      router.push("/emp/chats");
    }
  }, []);

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      // Make a request to your backend API with Axios
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/employee/login`,
        values
      );

      // If the response is successful (status code 2xx)
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        Cookies.set("employee_access_token", data.employee_access_token, {
          expires: 2,
        });

        // Save the token or user information in your preferred way (e.g., localStorage, cookies)
        localStorage.setItem(
          "employee_access_token",
          data.employee_access_token
        );

        // user will logout after token expire
        // Use moment to handle dates
        const expiresAt = moment(data.expires_at);
        const currentTime = moment();
        const expiresInMilliseconds = expiresAt.diff(currentTime);

        setTimeout(() => {
          // Remove token from localStorage
          localStorage.removeItem("employee_access_token");
          // Redirect to the login page
          router.push("/emp/login");
        }, expiresInMilliseconds);

        console.log("login success");

        // Redirect to the dashboard or another page upon successful login
        router.push("/emp/chats");
      } else {
        // Handle errors, e.g., display error messages to the user

        setLoginError(response.data.error);
      }
    } catch (error) {
      console.error("Error in login:", error.response.data.error);
      setLoginError(error.response.data.error);
    } finally {
      setLoading(false);
      // setSubmitting(false);
    }
  };
  if ( cookie) {
    return <ChatHeader />;
  } else {
    return (
      <div className="login-body omni-scroll-bar">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="flex w-screen h-auto flex-col justify-center items-center px-16 py-12 max-md:px-5 max-md:py-0">
            <header className="bg-white w-[1296px] overflow-hidden max-w-full mt-20 mb-12 pl-20 rounded-[40px] max-md:my-10 max-md:pl-0">
              <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0 ">
                <div className="flex flex-col items-stretch w-[42%] max-md:w-full max-md:ml-0 max-md:p-5">
                  <div className="flex flex-col my-auto max-md:max-w-full max-md:mt-10">
                    <h1 className="text-cyan-600 text-center text-2xl md:text-4xl font-bold self-stretch max-md:max-w-full">
                      Login to Omni-Channel
                    </h1>
                    {/* Display error message if login fails */}
                    {loginError && (
                      <div className="text-red-500 text-xl my-3 text-center capitalize">
                        <span className="text-yellow-500 mx-2">&#9888;</span>
                        {loginError}
                      </div>
                    )}

                    <div className="text-zinc-800 text-sm font-medium items-stretch bg-white justify-center mt-14 rounded-[50px] self-start max-md:mt-10">
                      Select Company
                    </div>

                    <label htmlFor="company_id" className="hidden">
                      Select Company
                    </label>
                    <Field
                      as="select"
                      id="company_id"
                      name="company_id"
                      aria-label="company_id"
                      aria-required="true"
                      className="w-full add_employee_inputs"
                    >
                      <option value="" disabled>
                        Select a company
                      </option>
                      {companies.map((company) => (
                        <option key={company.user_id} value={company.user_id}>
                          {company.user_name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="company_id"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                    <div className="text-zinc-800 text-sm font-medium items-stretch bg-white justify-center mt-14 rounded-[50px] self-start max-md:mt-10">
                      User Name
                    </div>

                    <label htmlFor="email" className="hidden">
                      User Name
                    </label>
                    <Field
                      type="text"
                      id="email"
                      name="email"
                      placeholder="Enter your user name"
                      aria-label="email"
                      aria-required="true"
                      className="w-full add_employee_inputs"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                    <div className="text-zinc-800 text-sm font-medium whitespace-nowrap items-stretch bg-white justify-center mt-9 pr-16 rounded-[50px] self-start max-md:pr-5">
                      Password
                    </div>

                    <label htmlFor="password" className="hidden">
                      Password
                    </label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter password"
                      aria-label="Password"
                      aria-required="true"
                      className="w-full add_employee_inputs"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                    <a
                      href="#"
                      className="text-cyan-600 text-sm underline self-stretch mt-3 max-md:max-w-full"
                    >
                      Forgot Password?
                    </a>
                    {loading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <ThreeDots
                          type="Puff"
                          color="#fff"
                          height={50}
                          width={50}
                        />
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="text-white text-sm whitespace-nowrap justify-center items-center bg-zinc-800 self-stretch mt-9 px-16 py-2.5 rounded-[50px] max-md:max-w-full max-md:px-5"
                      aria-label="Login"
                    >
                      {loading ? "Processing..." : "Login"}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-stretch flex-1 ml-5 w-full md:pr-0 max-md:w-full max-md:ml-0">
                  <div className="bg-cyan-600 flex-grow flex-col justify-center w-full pr-16 py-12 rounded-none items-start max-md:max-w-full max-md:mt-10 max-md:pr-5">
                    <Image
                      src={loginPageimage}
                      alt="Placeholder image"
                      className="aspect-[1.02] object-contain object-center w-full overflow-hidden mt-2.5 mb-3 max-md:max-w-full"
                    />
                  </div>
                </div>
              </div>
            </header>
            {loading && (
              <div className="text-zinc-800 text-sm my-3">Loading...</div>
            )}
          </Form>
        </Formik>
      </div>
    );
  }
};

export default Login_component;
