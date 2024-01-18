import React, { ReactNode, useEffect, useState } from "react";

import Sidebar from "./Sidebar";

import Navbar from "./Navbar";

import { useAppContext } from "./AppContext";

interface LayoutProps {
  children: ReactNode;
}
import { useRouter } from "next/router";
import { memo } from "react";
// import router from "next/router";

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
Footer.displayName = "Footer";
const Layout: React.FC<LayoutProps> = ({ children }: any) => {
  const { state, toggleState } = useAppContext();
  // const [uEmail, setEmail] = useState<any>(false);
  const router = useRouter();
  // const currentUrl = router.asPath;
  // const isPageIncluded = currentUrl.includes('/page');
  const { authenticated, toggleAuthenticated } = useAppContext();
  // console.log(authenticated, isPageIncluded)
  useEffect(() => {
    const isPageIncluded = router.asPath.includes("/page");
    const uEmail = sessionStorage.getItem("userEmail");
    if (!authenticated && isPageIncluded && !uEmail) {
      router.push("/");
    }
  }, [router.asPath]);
  return (
    <div
      id="appLayout"
      className="flex text-black bg-gray-100 h-screen"
      // style={{ backgroundColor: "rgba(254, 241, 235, 0.40)" }}
    >
      <title>ABG-Automation</title>
      <Sidebar />
      <div
        className="flex-auto relative h-[100vh] bg-gray-100   overflow-auto"
        // style={{ backgroundColor: "rgba(254, 241, 235, 0.40)" }}
      >
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
