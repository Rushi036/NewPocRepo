import React, { useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TabIcon from "@mui/icons-material/Tab";
import Link from "next/link";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import { useAppContext } from "./AppContext";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";

const Sidebar = () => {
  const { state, toggleState } = useAppContext();
  const toggleStateHere = () => {
    toggleState();
  };
  const [activeLink, setActiveLink] = useState(null);

  // Function to handle link clicks and set the active link
  const handleLinkClick = (index: any) => {
    setActiveLink(index);
  };

  const Footer = () => {
    return (
      <footer className="footer bg-white text-neutral-content  bottom-0 w-full fixed z-10">
        <div className="container mx-auto flex justify-between items-center h-16">
          <div
            className={`${state ? "mx-60" : ""} flex items-center text-black`}
          >
            <p className="mr-2 stroke--black">
              {" "}
              2023 - All Rights Reserved,{" "}
              <strong className="text-red-800">
                Aditya Birla Management Corporation Pvt. Ltd
              </strong>
            </p>
          </div>
          <div className="flex gap-4 text-black">
            <div>About Us</div>
            <div>Help</div>
            <div>Contact Us</div>
          </div>
        </div>
      </footer>
    );
  };

  return (
    <>
      <div
        className={`${
          state ? "w-1/5" : "w-fit"
        } bottom-0 z-30 top-0 hidden shadow-2xl sm:block fixed  transition-all duration-300 bg-white border-r`}
      >
        <img
          src="/abgLogo.jpg"
          className={`${!state && "hidden"} ml-9 pt-2 h-28 w-44 `}
          alt="abg Logo"
        />
        <div className={`${state ? "mt-0" : "mt-14"} mr-3 `}></div>
        <div
          className={`${
            !state && "rotate-180"
          }  absolute mr-1.5 text-xl bg-white fill-slate-800 rounded-full cursor-pointer top-6 -right-4`}
          onClick={toggleStateHere}
        >
          <BsArrowLeftCircle />
        </div>

        <ul className="space-y-1.5 pt-5">
          <li>
            <Link
              href="/page/Dashboard/Dashboard"
              className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
             text-slate-700 rounded-md hover:bg-gray-100 dark:text-black
             ${activeLink === 0 ? "bg-gray-100" : ""}`}
              onClick={() => handleLinkClick(0)}
            >
              <DashboardIcon />
              <span className={`${!state && "hidden"} origin-left hover:block`}>
                Dashboard
              </span>
            </Link>
          </li>
          <li className="hs-accordion" id="users-accordion">
            <Link
              href="/Components/Assets"
              className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
              text-slate-700 rounded-md hover:bg-gray-100 dark:text-black
              ${activeLink === 1 ? "bg-gray-100" : ""}`}
              onClick={() => handleLinkClick(1)}
            >
              <DeviceHubIcon />
              <span className={`${!state && "hidden"} origin-left hover:block`}>
                Assets
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/Components/Observability"
              className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
              text-slate-700 rounded-md hover:bg-gray-100 dark:text-black
              ${activeLink === 2 ? "bg-gray-100" : ""}`}
              onClick={() => handleLinkClick(2)}
            >
              <TabIcon />
              <span className={`${!state && "hidden"} origin-left hover:block`}>
                Observability
              </span>
            </Link>
          </li>
          <li className="hs-accordion" id="account-accordion">
            <Link
              href="/Components/FinOps"
              className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
              text-slate-700 rounded-md hover:bg-gray-100 dark:text-black
              ${activeLink === 3 ? "bg-gray-100" : ""}`}
              onClick={() => handleLinkClick(3)}
            >
              <SpaceDashboardIcon />
              <span className={`${!state && "hidden"} origin-left hover:block`}>
                FinOps
              </span>
            </Link>
          </li>
          {/* Repeat similar code for other links */}
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default Sidebar;
