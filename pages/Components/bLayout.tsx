import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}
const BLayout: React.FC<LayoutProps> = ({ children }: any) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default BLayout;
