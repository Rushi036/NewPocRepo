import Link from "next/link";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [role, setRole] = useState<any>();
  useEffect(() => {
    setRole(sessionStorage.getItem("userRole"));
  }, []);

  return (
    <div className="bg-gray-100 min-h-fit p-4">
      <div className="text-xl  border-b-2 border-gray-400 mb-4 pb-2">
        Dashboard
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Widgets for Admin */}
        {role === "ADMIN" && (
          <>
            <Link href="/page/FinOps">
              <div className="bg-white p-6 h-[25vh] rounded-lg shadow hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105">
                <div className="font-bold text-lg mb-2">Cost Control</div>
                <p className="text-sm text-gray-600 mb-1">Budgeted</p>
                <p className="text-sm text-gray-600 mb-1">Projected</p>
                <p className="text-sm text-gray-600">Current Spent</p>
              </div>
            </Link>
            <div className="bg-white p-6 rounded-lg  h-[25vh] shadow hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105">
              <div className="font-bold text-lg mb-2">Security Score</div>
              <p className="text-sm text-gray-600 mb-1">Private</p>
              <p className="text-sm text-gray-600 mb-1">AWS</p>
              <p className="text-sm text-gray-600">Azure</p>
            </div>
            <div className="bg-white p-6 rounded-lg  h-[25vh] shadow hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105">
              <div className="font-bold text-lg mb-2">Business Service</div>
              <p className="text-sm text-gray-600">3/5...</p>
            </div>
            <div className="bg-white p-6 rounded-lg  h-[25vh] shadow hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105">
              <div className="font-bold text-lg mb-2">Managed Assets</div>
              <p className="text-sm text-gray-600">100/1500</p>
            </div>
            <div className="bg-white p-6 rounded-lg  h-[25vh] shadow hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105">
              <div className="font-bold text-lg mb-2">Active Incidents</div>
              <p className="text-sm text-gray-600">18</p>
            </div>
            <div className="bg-white p-6 rounded-lg  h-[25vh] shadow hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105">
              <div className="font-bold text-lg mb-2">
                Active Service Requests
              </div>
              <p className="text-sm text-gray-600">18</p>
            </div>
          </>
        )}

        {/* Widgets for User */}
        {role !== "ADMIN" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105">
              <div className="font-bold text-lg mb-2">
                Active service on AWS
              </div>
              <p className="text-xl text-purple-500">1</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105">
              <div className="font-bold text-lg mb-2">
                Active service on Azure
              </div>
              <p className="text-xl text-blue-500">2</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105">
              <div className="font-bold text-lg mb-2">
                Service Request Pending
              </div>
              <p className="text-xl text-green-500">2</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105">
              <div className="font-bold text-lg mb-2">Active Services</div>
              <p className="text-xl text-yellow-500">5</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
