import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [role, setRole] = useState<any>();
  useEffect(() => {
    setRole(sessionStorage.getItem("userRole"));
  });
  return (
    <>
      <div className="text-xl border-b-2  border-slate-400 pb-2 px-4">
        Dashboard
      </div>

      {/* For Business User */}
      {role != "ADMIN" ? (
        <div className="cards-container  w-auto">
          <div className="w-32 card">
            {" "}
            {/* Adjust the width class to your desired width */}
            <div id="chart-1">
              <p>
                <b>Active service on AWS</b>
              </p>
              <b>1</b>
            </div>
          </div>

          <div className="card card2">
            <div id="chart-2">
              <p>
                <b>Active service on Azure</b>
              </p>

              <b>2</b>
            </div>
          </div>

          <div className="card card3">
            <div id="chart-3">
              <p>
                <b> Service Request Pending</b>
              </p>
              <b>2</b>
            </div>
          </div>

          <div className="card card4">
            <div id="chart-4">
              <p>
                <b>Active Services</b>
              </p>

              <b>5</b>
            </div>
          </div>
        </div>
      ) : (
        /* For Admin */

        <div className="cards-container">
          <div className="card card1">
            <div id="chart-1">
              <p>
                <b>Total Cloud Services</b>
              </p>

              <b>2</b>
            </div>
          </div>

          <div className="card card2">
            <div id="chart-2">
              <p>
                <b>On-Boarded business</b>
              </p>

              <b>15</b>
            </div>
          </div>

          <div className="card card3">
            <div id="chart-3">
              <p>
                <b>Active Subscriptions in Azure</b>
              </p>

              <b>51</b>
            </div>
          </div>

          <div className="card card4">
            <div id="chart-4">
              <p>
                <b>Active Subscriptions in AWS</b>
              </p>

              <b>36</b>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
