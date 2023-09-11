import Link from "next/link";

import React, { useState } from "react";

import Image from "next/image";

import Layout from "@/pages/Components/bLayout";

import { login } from "@/pages/api/login";
import { useRouter } from 'next/router';
const Login = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const [link, setLink] = useState("");

  const router = useRouter();

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

    async function dataFetch() {
      const data = await login(email, password);
      console.log("------------------", data);
      if (data?.data[0]) {
        if (data.data[0].role != "admin") {
          localStorage.setItem("userName", data.data[0].name);
          localStorage.setItem("role", data.data[0].role);
          localStorage.setItem("bu_id", data.data[0].id);
        }
        router.push("/page/Dashboard/Dashboard");
      }
    }

    dataFetch();
  };

  return (
    <div className="flex w-auto justify-center items-center bord h-fit mt-12">
        <div className="bg-white shadow-xl p-4 w-full max-w-md">
          <img
            src="/abgLogo.jpg"
            height={150}
            width={350}
            alt="Logo"
            className="mx-auto mb-4"
          />
          {/* <h1 className="text-xl font-bold pb-4 leading-tight tracking-tight text-gray-900 ">
            Sign in to your account
          </h1> */}
          <form className="md:space-y-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="field1" className="block pb-2 text-gray-600">
                Your Email
              </label>
              <input
                type="text"
                id="field1"
                name="field1"
                className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
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
                className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter Password"
                onChange={handlePasswordChange}
                value={password}
                required
              />
            </div>
            {/* <Link href={link}> */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="z-70 cursor-pointer w-full mt-7 text-white bg-red-800 hover:bg-primary-700 focus:ring-4 focus:outline-none
               focus:ring-primary-300 font-medium rounded-lg text-sm my-4 px-5 py-2.5 text-center"
              // disabled={!isFormValid}
            >
              Sign in
            </button>
            {/* </Link> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
