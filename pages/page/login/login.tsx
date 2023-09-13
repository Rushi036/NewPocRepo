import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import Layout from "@/pages/Components/bLayout";
import { login } from "@/pages/api/login";
import { useRouter } from "next/router";

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
        localStorage.setItem("userName", data.data[0].name);
        localStorage.setItem("role", data.data[0].role);
        if (data.data[0].role != "admin") {
          localStorage.setItem("bu_id", data.data[0].id);
        }
        // }else {
        router.push("/page/Dashboard/Dashboard");
      } else {
        window.alert(
          "Login failed. Please check your email and password and try again."
        );
      }
    }

    dataFetch();
  };

  return (
    <div>
      <br></br>
      <div className="flex w-auto justify-center items-center">
        <br></br>
        <div
          className="bg-white shadow-xl w-full max-w-md"
          style={{ borderRadius: "25px", padding: "20px" }}
        >
          <img
            src="/abgLogo.jpg"
            height={150}
            width={300}
            alt="Logo"
            className="mx-auto mb-4"
          />
          <br></br>
          {/* <h1 className="text-xl font-bold pb-4 leading-tight tracking-tight text-gray-900 ">
            Sign in to your account
          </h1> */}
          <form className="md:space-y-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <i className="fa fa-envelope icon"></i>
              <label htmlFor="email" className="block pb-2 text-gray-600">
                <label className="text-red-600">*</label>Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter Email"
                onChange={handleEmailChange}
                value={email}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="pb-2 block text-gray-600">
                <label className="text-red-600">*</label>Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter Password"
                onChange={handlePasswordChange}
                value={password}
                required
              />
            </div>
            <button
              type="submit"
              className="cursor-pointer w-full text-white bg-red-800 hover:bg-primary-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              style={{ marginTop: "34px" }}
            >
              Sign in
            </button>
          </form>
          <br></br>
        </div>
      </div>
      <br></br>
    </div>
  );
};

export default Login;
