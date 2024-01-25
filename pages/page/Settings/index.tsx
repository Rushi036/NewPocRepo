import { getIcons } from "@/pages/api/getIcons";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Settings() {
  return (
    <div className="w-full flex flex-col gap-3">
      <Link href={'/page/Settings/manageNetworks'}>
        <div className="w-full bg-white rounded-xl border px-4 py-3">Manage Networks</div>
      </Link>
      <Link href={'/page/FinOps/Settings'}>
        <div className="w-full bg-white rounded-xl border px-4 py-3">FinOps Settings</div>
      </Link>
    </div>
  );
}

export default Settings;
