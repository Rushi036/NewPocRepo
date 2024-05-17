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
import SettingsIcon from "@mui/icons-material/Settings";

import { AppContextProvider } from "./AppContext";
const Sidebar = () => {
  const { state, toggleState } = useAppContext();

  const {access,toggleAccess} = useAppContext();

  const toggleStateHere = () => {
    toggleState();
  };
  const [activeLink, setActiveLink] = useState(null);
  const [uRole, setUrole] = useState<any>(false);
  const [bLogo, setBlogo] = useState<any>(false);

  useEffect(() => {
    setUrole(sessionStorage.getItem("userRole"));
    setBlogo(sessionStorage.getItem("businessLogo"));
    toggleAccess(sessionStorage.getItem("access"));

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
        style={{
          background: state
            ? " linear-gradient(180deg, #FFF 0%, rgba(254, 241, 235, 0.40) 100%)"
            : "rgba(254, 241, 235, 0.24)",
        }}
      >
        <img
          src={bLogo ? `/${bLogo}` : "/Common.jpg"}
          className={`${
            !state && "hidden"
          } mx-auto p-2 w-auto max-h-[120px] aspect-[16/9]`}
          alt="abg Logo"
        />
        <div className={`${state ? "mt-0" : "mt-14"} mr-3 `}></div>
        <div
          className={`${
            !state && "rotate-180"
          }  absolute mr-1.5 text-xl text-white rounded-full cursor-pointer top-3 -right-10`}
          onClick={toggleStateHere}
        >
          <GiHamburgerMenu />
        </div>

        <ul className="space-y-1.5 pt-5">
          <li>
            <Link
              href={access == "SSP" ? "/page/CloudProjects/request":"/page/Dashboard"}
              className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
             text-slate-700 rounded-md hover:bg-orange-100
             `}
              onClick={() => handleLinkClick(0)}
              style={
                activeLink === 0
                  ? {
                      background:
                        "radial-gradient(50% 75% at 50% 100%, rgba(243, 112, 50, 0.32) 0%, rgba(243, 112, 50, 0.00) 100%)",
                    }
                  : {}
              }
            >
              <HomeIcon className="h-7 w-7" />
              <span className={`${!state && "hidden"} origin-left hover:block`}>
                Dashboard
              </span>
            </Link>
          </li>
          {/* {uRole == "ADMIN" ? (
            <li className="hs-accordion" id="users-accordion">
              <Link
                href="/page/AssetsForAdmin"
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
                href="/page/Assets"
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
          )} */}
          {uRole == "ADMIN" && (
            <li>
              <Link
                href="/page/UserManagement"
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
              text-slate-700 rounded-md hover:bg-orange-100
              `}
                onClick={() => handleLinkClick(2)}
                style={
                  activeLink === 2
                    ? {
                        background:
                          "radial-gradient(50% 75% at 50% 100%, rgba(243, 112, 50, 0.32) 0%, rgba(243, 112, 50, 0.00) 100%)",
                      }
                    : {}
                }
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
          {uRole == "ADMIN" && (
            <li>
              <Link
                href="/page/FinOps/Settings"
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
              text-slate-700 rounded-md hover:bg-orange-100
`}
                onClick={() => handleLinkClick(3)}
                style={
                  activeLink === 3
                    ? {
                        background:
                          "radial-gradient(50% 75% at 50% 100%, rgba(243, 112, 50, 0.32) 0%, rgba(243, 112, 50, 0.00) 100%)",
                      }
                    : {}
                }
              >
                <SettingsIcon className="h-7 w-7" />
                <span
                  className={`${!state && "hidden"} origin-left hover:block`}
                >
                  Settings
                </span>
              </Link>
            </li>
          )}
          {uRole != "ADMIN" && (
            <li>
              <Link
                href="/Components/Observability"
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
              text-slate-700 rounded-md hover:bg-orange-100
              `}
                onClick={() => handleLinkClick(2)}
                style={
                  activeLink === 2
                    ? {
                        background:
                          "radial-gradient(50% 75% at 50% 100%, rgba(243, 112, 50, 0.32) 0%, rgba(243, 112, 50, 0.00) 100%)",
                      }
                    : {}
                }
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
          {/* <li className="hs-accordion" id="account-accordion">
            <Link
              href="/page/FinOps"
              className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
              text-slate-700 rounded-md hover:bg-gray-100
              ${activeLink === 3 ? "bg-gray-100" : ""}`}
              onClick={() => handleLinkClick(3)}
            >
              <SpaceDashboardIcon className="h-7 w-7" />
              <span className={`${!state && "hidden"} origin-left hover:block`}>
                FinOps
              </span>
            </Link>
          </li>
          <li className="hs-accordion" id="account-accordion">
            <Link
              href="/page/FinOps/newFinops"
              className={`flex items-center gap-x-3.5 py-2 px-2.5 text-base
              text-slate-700 rounded-md hover:bg-gray-100
              ${activeLink === 4 ? "bg-gray-100" : ""}`}
              onClick={() => handleLinkClick(4)}
            >
              <SpaceDashboardIcon className="h-7 w-7" />
              <span className={`${!state && "hidden"} origin-left hover:block`}>
                New FinOps
              </span>
            </Link>
          </li> */}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
