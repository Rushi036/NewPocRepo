import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PreviewIcon from "@mui/icons-material/Preview";
import TabIcon from "@mui/icons-material/Tab";
import Link from "next/link";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import { useAppContext } from "./AppContext";
import HomeIcon from "@mui/icons-material/Home";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import GroupIcon from "@mui/icons-material/Group";
const Sidebar = () => {
  const { state, toggleState } = useAppContext();

  const toggleStateHere = () => {
    toggleState();
  };
  const [activeLink, setActiveLink] = useState(null);
  const [uRole, setUrole] = useState<any>(false);

  useEffect(() => {
    setUrole(sessionStorage.getItem("userRole"));
  }, []);
  // Function to handle link clicks and set the active link
  const handleLinkClick = (index: any) => {
    setActiveLink(index);
  };

  return (
    <>
      <div
        className={`${
          state ? "w-1/5 min-w-[250px]" : "w-fit"
        } bottom-0 z-30 top-0 hidden relative shadow-2xl sm:block transition-all duration-300 bg-white border-r`}
      >
        <img
          src="/abgLogo.jpg"
          className={`${
            !state && "hidden"
          } mx-auto p-2 w-auto max-h-[120px] aspect-[16/9]`}
          alt="abg Logo"
        />
        <div className={`${state ? "mt-0" : "mt-14"} mr-3 `}></div>
        <div
          className={`${
            !state && "rotate-180"
          }  absolute mr-1.5 text-xl bg-white fill-slate-800 rounded-full cursor-pointer top-3 -right-10`}
          onClick={toggleStateHere}
        >
          <GiHamburgerMenu />
        </div>

        <ul className="space-y-1.5 pt-5">
          <li>
            <Link
              href="/page/Dashboard/Dashboard"
              className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
             text-slate-700 rounded-md hover:bg-gray-100
             ${activeLink === 0 ? "bg-gray-100" : ""}`}
              onClick={() => handleLinkClick(0)}
            >
              <HomeIcon className="h-7 w-7" />
              <span className={`${!state && "hidden"} origin-left hover:block`}>
                Dashboard
              </span>
            </Link>
          </li>
          {uRole == "ADMIN" ? (
            <li className="hs-accordion" id="users-accordion">
              <Link
                href="/Components/AssetsForAdmin"
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
              text-slate-700 rounded-md hover:bg-gray-100
              ${activeLink === 1 ? "bg-gray-100" : ""}`}
                onClick={() => handleLinkClick(1)}
              >
                <DeviceHubIcon className="h-7 w-7" />
                <span
                  className={`${!state && "hidden"} origin-left hover:block`}
                >
                  Service Request
                </span>
              </Link>
            </li>
          ) : (
            <li className="hs-accordion" id="users-accordion">
              <Link
                href="/Components/Assets"
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
              text-slate-700 rounded-md hover:bg-gray-100
              ${activeLink === 1 ? "bg-gray-100" : ""}`}
                onClick={() => handleLinkClick(1)}
              >
                <DeviceHubIcon className="h-7 w-7" />
                <span
                  className={`${!state && "hidden"} origin-left hover:block`}
                >
                  Assets
                </span>
              </Link>
            </li>
          )}
          {uRole == "ADMIN" && (
            <li>
              <Link
                href="/Components/UserManagement"
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
              text-slate-700 rounded-md hover:bg-gray-100
              ${activeLink === 2 ? "bg-gray-100" : ""}`}
                onClick={() => handleLinkClick(2)}
              >
                <GroupIcon className="h-7 w-7" />
                <span
                  className={`${!state && "hidden"} origin-left hover:block`}
                >
                  User Management
                </span>
              </Link>
            </li>
          )}
          {uRole != "ADMIN" && (
            <li>
              <Link
                href="/Components/Observability"
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
              text-slate-700 rounded-md hover:bg-gray-100
              ${activeLink === 2 ? "bg-gray-100" : ""}`}
                onClick={() => handleLinkClick(2)}
              >
                <PreviewIcon className="h-7 w-7" />
                <span
                  className={`${!state && "hidden"} origin-left hover:block`}
                >
                  Observability
                </span>
              </Link>
            </li>
          )}
          {/* {uRole != "ADMIN" && ( */}
            <li className="hs-accordion" id="account-accordion">
              <Link
                href="/page/FinOps"
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
              text-slate-700 rounded-md hover:bg-gray-100
              ${activeLink === 3 ? "bg-gray-100" : ""}`}
                onClick={() => handleLinkClick(3)}
              >
                <SpaceDashboardIcon className="h-7 w-7" />
                <span
                  className={`${!state && "hidden"} origin-left hover:block`}
                >
                  FinOps
                </span>
              </Link>
            </li>
          {/* )} */}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
