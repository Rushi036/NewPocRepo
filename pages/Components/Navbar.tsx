import React, { useEffect, useRef, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleClientNameClick = () => {
    setPopupOpen(!isPopupOpen);
  };
  const popupRef = useRef<any>(null);
  const handleOutsideClick = (e:any) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setPopupOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mouseleave', handleOutsideClick);
    // return () => {
    //   document.removeEventListener('mouseleave', handleOutsideClick);
    // };
  }, []);
  return (
    <div onClick={handleOutsideClick}>
    <nav className="bg-white border-gray-700 shadow-lg dark:bg-gray-900 fixed w-full z-20 h-16 flex">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
        <a href="/" className="flex items-center"></a>
      </div>
      <div className="flex ml-auto mr-5 items-center">
      <AccountCircleIcon className="w-8 h-8 mr-2"/>
        <div className="relative">
          <span
            className="cursor-pointer client-name"
            onClick={handleClientNameClick}
          >
            Client Name
          </span>
          {isPopupOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
              <ul>
                <li className="p-2 cursor-pointer ml-10 hover:bg-gray-100 font-semibold">
                  Sign Out
                </li>
              
              </ul>
            </div>
          )}
        </div>
      
      </div>
    </nav>
  </div>

  );
};

export default Navbar;
