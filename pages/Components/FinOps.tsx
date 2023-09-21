import React, { useEffect, useState } from "react";
import { finOps } from "../api/finOps";

const FinOps = () => {
  let bu_id: string | null;
  const [url, setUrl] = useState<any>();
  const [data, setData] = useState<any>(null);
  // if (typeof window !== "undefined") {
  // role = localStorage.getItem("role");
  useEffect(() => {
    bu_id = localStorage.getItem("bu_id");
    dataFetch();
  }, []);
  // }
  async function dataFetch() {
    const res: any = await finOps(bu_id);
    setData(res.data);
    // setUrl(data[1]);
  }
  data && console.log("finops data", data[0].link);
  return (
    <div className="h-full">
      <div className="text-xl border-b-2 px-4 border-slate-400 pb-2">
        FinOps
      </div>
      {data ? (
        <div className="p-4 mt-4 h-screen overflow-hidden">
          <div className="overflow-y-auto h-full">
            <iframe
              src={data[0].link}
              width="100%"
              height="100%"
              title="FinOps"
            ></iframe>
          </div>
        </div>
      ) : (
        <div className="flex justify-center p-4 w-full">
          <div className="">No Data Found</div>
        </div>
      )}
    </div>
  );
};

export default FinOps;
