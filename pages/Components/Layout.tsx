import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAppContext } from "./AppContext";

interface LayoutProps {
  children: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }: any) => {
  const {state , toggleState} = useAppContext();

  return (
    <div id="appLayout" className="flex text-black h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-auto">
        <div>
        <Navbar />
        </div>
        <main className={`${state ? "w-4/5" : "w-auto ml-10"} my-20 pl-6 w-4/5 ml-auto pb-16 pr-6`}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;