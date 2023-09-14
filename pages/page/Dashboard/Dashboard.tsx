import React, { useEffect, useState } from "react";

const Dashboard = () => {
  return (
    <>
      <div className="text-xl border-b-2  border-slate-400 pb-2 px-4">Dashboard</div>
      <div className="cards-container">
        <div className="card card1">
          <div id="chart-1">
            </div>
        </div>
        <div className="card card2">
          <div id="chart-2"></div>
        </div>
        <div className="card card3">
          <div id="chart-3"></div>
        </div>
        <div className="card card4">
          <div id="chart-4"></div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;
