import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import Layout from "@/pages/Components/bLayout";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const isFormValid = email !== "" && password !== "";

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e: any) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Perform form submission logic here
    console.log("Form submitted");
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 mx-auto my-16 lg:py-0">
      <a
        href="#"
        className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        {/* image */}
      </a>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="field1" className="block pb-2 text-gray-600">
                Your Email
              </label>
              <input
                type="text"
                id="field1"
                name="field1"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter Email"
                onChange={handleEmailChange}
                value={email}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="field1" className=" pb-2 block text-gray-600">
                Your Passowrd
              </label>
              <input
                type="text"
                id="field1"
                name="field1"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter Password"
                onChange={handlePasswordChange}
                value={password}
                required
              />
            </div>
            <Link href="/page/Dashboard/Dashboard">
              <button
                type="submit"
                className="w-full mt-7 text-white bg-red-800 hover:bg-primary-700 focus:ring-4 focus:outline-none
               focus:ring-primary-300 font-medium rounded-lg text-sm my-4 px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={!isFormValid}
              >
                Sign in
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
