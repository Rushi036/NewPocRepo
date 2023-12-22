import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}
const BLayout: React.FC<LayoutProps> = ({ children }: any) => {
  
  return (
    
    <div
      style={{
        position: "relative",
        height: "100vh",
      }}
    >
      <title>ABG-Automation</title>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundImage: 'url("/grayBG.jpg")',

          backgroundSize: "cover",
          opacity: 0.2,
        }}
      ></div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          color: "white",
        }}
      >
        <div className="flex-1 overflow-x-hidden overflow-y-auto z-10">
          {/* Page content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default BLayout;
