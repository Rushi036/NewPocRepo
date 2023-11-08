import React, { useEffect, useRef, useState } from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";

import Link from "next/link";
import { useMsal } from "@azure/msal-react";

const Navbar = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const { instance } = useMsal();
  const [isSignOutModalOpen, setSignOutModalOpen] = useState(false);
  const router = useRouter();
  const [uname, setUname] = useState<any>(false);

  useEffect(() => {
    setUname(sessionStorage.getItem("userName"));
    // setUname(localStorage.getItem("userName"));
  }, []);

  const handleClientNameClick = () => {
    setPopupOpen(!isPopupOpen);
  };

  const handleSignOutClick = async () => {
    setSignOutModalOpen(true);

    // try {
    //   await instance.logoutPopup();
    //   router.push("/");
    //   sessionStorage.clear();
    //   localStorage.clear();
    // } catch (error) {
    //   console.log("Logout error", error);
    // }
  };

  const handleSignOutConfirm = () => {
    // Perform sign-out logic here
    localStorage.clear();
    sessionStorage.clear();
    setSignOutModalOpen(false);
  };

  const handleSignOutCancel = () => {
    setSignOutModalOpen(false);
  };

  useEffect(() => {
    if (isPopupOpen) {
      setTimeout(() => {
        handleClientNameClick();
      }, 3000);
    }
  }, [isPopupOpen]);

  useEffect(() => {
    const mouseLeaveListener = (e: any) => {
      if (isPopupOpen) {
        setPopupOpen(false);
      }
    };

    document.addEventListener("mouseleave", mouseLeaveListener);

    return () => {
      document.removeEventListener("mouseleave", mouseLeaveListener);
    };
  }, [isPopupOpen]);

  const popupRef = useRef<any>(null);

  const handleOutsideClick = (e: any) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setPopupOpen(false);
    }
  };

  return (
    <div onClick={handleOutsideClick}>
      <nav className="bg-white border-gray-700 shadow-lg w-full z-20 h-10 flex fixed top-0 right-0">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
          <Link href="/" className="flex items-center"></Link>
        </div>

        <div className="flex ml-auto mr-5 items-center">
          <AccountCircleIcon className="w-8 h-8 mr-2" />

          <div className="relative">
            <span
              className="cursor-pointer"
              onMouseEnter={handleClientNameClick}
            >
              {uname}
            </span>

            {isPopupOpen && (
              <div
                ref={popupRef}
                className="absolute right-0 mt-2 w-40 hover:bg-gray-100 bg-white border border-gray-300 rounded-md shadow-lg"
              >
                <ul>
                  <li
                    className="p-2 cursor-pointer ml-10 font-semibold"
                    onClick={handleSignOutClick}
                  >
                    Sign Out
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sign Out Confirmation Modal */}

      {isSignOutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white border-2 border-gray-600 px-7 py-4 rounded-lg shadow-xl">
            <p className="text-lg">Are you sure you want to sign out?</p>

            <div className="mt-4 flex justify-end">
              <Link href="/">
                <button
                  className="mr-4 px-4 py-1 bg-red-800 text-white rounded-md"
                  onClick={handleSignOutConfirm}
                >
                  Yes
                </button>
              </Link>

              <button
                className="px-4 py-1 bg-gray-300 text-gray-700 rounded-lg"
                onClick={handleSignOutCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
