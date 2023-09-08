import React, { useEffect, useRef, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";

const Navbar = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isSignOutModalOpen, setSignOutModalOpen] = useState(false);
  const [uname, setUname] = useState<any>(false);
  ;
  
  useEffect(() => {
    setUname(localStorage.getItem("userName"))
  }, []);
  const handleClientNameClick = () => {
    setPopupOpen(!isPopupOpen);
  };

  const handleSignOutClick = () => {
    setSignOutModalOpen(true);
  };

  const handleSignOutConfirm = () => {
    // Perform sign-out logic here
    localStorage.clear();
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
      <nav className="bg-white border-gray-700 shadow-lg w-full z-20 h-16 flex">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
          <a href="/" className="flex items-center"></a>
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
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <p>Are you sure you want to sign out?</p>
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
