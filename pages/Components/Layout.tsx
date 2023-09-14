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
    <footer
      className={`px-4 flex footer bg-white bottom-0 text-neutral-content w-full z-10`}
    >
      <div className="flex justify-center  w-full items-center h-16">
        <div className={` flex items-center text-black`}>
          <p className="mr-2 stroke--black">
            {" "}
            &copy;2023 - All Rights Reserved,{" "}
            <strong className="text-red-800">
            Aditya Birla Group
            </strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }: any) => {
  const { state, toggleState } = useAppContext();

  return (
    <div id="appLayout" className="flex text-black h-screen bg-gray-100">
      <title>ABG-Automation</title>
      <Sidebar />
      <div className="flex-auto relative h-[100vh] bg-gray-100 overflow-auto">
        <Navbar />
        <main className="mt-16 overflow-auto p-4 min-h-[calc(100vh-8rem)]">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
