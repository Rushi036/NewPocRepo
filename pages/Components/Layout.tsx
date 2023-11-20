import React, { ReactNode } from "react";

import Sidebar from "./Sidebar";

import Navbar from "./Navbar";

import { useAppContext } from "./AppContext";

interface LayoutProps {
  children: ReactNode;
}

import { memo } from "react";

const Footer = memo(() => (
  <footer
    className={`px-4 h-12 footer items-center text-center bg-white bottom-0 text-neutral-content w-full z-10`}
  >
    <p className="text-black text-center">
      <span className="text-xs">&copy; 2023</span>{" "}
      <strong className="text-red-800 text-xs">
        Birla Management Centre Services Private Limited (BMCSPL).
      </strong>{" "}
      <span className="text-xs">All Rights Reserved.</span>
    </p>
    <p className="text-xs text-center">
      All content, trademarks, logos, and intellectual property on this portal
      are the property of the Aditya Birla Group and its entities. Any
      unauthorized use, reproduction, or distribution is strictly prohibited.
    </p>
  </footer>
));
Footer.displayName = 'Footer';
const Layout: React.FC<LayoutProps> = ({ children }: any) => {
  const { state, toggleState } = useAppContext();

  return (
    <div id="appLayout" className="flex text-black h-screen bg-gray-100">
      <title>ABG-Automation</title>
      <Sidebar />
      <div className="flex-auto relative h-[100vh] bg-gray-100 overflow-auto">
        <Navbar />
        <main className="mt-10 p-4  min-h-[calc(100vh-5.5rem)]">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
