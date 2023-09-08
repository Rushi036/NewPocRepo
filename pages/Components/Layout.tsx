import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAppContext } from "./AppContext";

interface LayoutProps {
  children: ReactNode;
}
const Footer = () => {
  const { state, toggleState } = useAppContext();
  return (
    <footer className="px-4 flex footer bg-white absolute bottom-0 text-neutral-content w-full z-10">
      <div className="flex justify-between  w-full items-center h-16">
        <div className={` flex items-center text-black`}>
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
const Layout: React.FC<LayoutProps> = ({ children }: any) => {
  const { state, toggleState } = useAppContext();

  return (
    <div
      id="appLayout"
      className="flex text-black h-screen bg-gray-100"
    >
      <Sidebar />
      <div className="flex-auto relative ">
        <Navbar />
        <main className="mt-4">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
