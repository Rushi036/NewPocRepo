import { getIcons } from "@/pages/api/getIcons";
import React, { useEffect, useState } from "react";

function AddNetworks() {
  return (
    <div className="bg-white w-full p-3 rounded-xl">
      <h1>Add Network -</h1>
      <form action="">
        <div className="flex flex-row gap-5">
          <div className="cursor-pointer w-[100px] h-[100px] flex justify-center items-center shadow-[inset_0_0_0_5px_white] bg-slate-200 text-slate-400 rounded border">
            +
          </div>
          <div className="flex flex-col">
            <label>Network Title</label>
            <input type="text" placeholder="Title" />
            <label>Choose parent</label>
            <select name="" id="">
              <option value="">none</option>
            </select>
          </div>
        </div>
        <button className="bg-blue-500 text-white px-4 py-1 rounded">Add</button>
      </form>
    </div>
  );
}

function EditNetworks() {
  return <div>editNetworks</div>;
}

function ShowNetworks() {
  const [network_icons, setNetworkIcons] = useState<any>(null);
  useEffect(() => {
    async function dataFetch() {
      await getIcons().then((res: any) => {
        setNetworkIcons(res.data);
      });
    }
    dataFetch();
  }, []);

  return (
    <div className="w-[13rem] flex flex-col gap-3">
      <div
        className={
          "editor-options min-h-[50vh] overflow-y-auto bg-white rounded-xl !p-3"
        }
      >
        <h4 className="mb-4">Newtorks -</h4>
        <div className="modal" style={{ display: "contents" }}>
          <ul>
            {network_icons &&
              network_icons.map((x: any, i: any) => {
                return (
                  <li key={i} className={"flex !flex-col "}>
                    <div className="flex gap-2">
                      <img src={x.Path} /> <p>{x.Name}</p>
                    </div>
                    <div className={"flex flex-col"}>
                      {x?.SubCategory?.map((y: any, j: any) => {
                        return (
                          <div key={j} className={"flex gap-2 ml-3 my-1 p-1"}>
                            <img key={j} src={y.Path} /> <p>{y.Name}</p>
                          </div>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function AddNetworksToggle({ setAddNetworksForm }: any) {
  return (
    <div
      onClick={() => {
        setAddNetworksForm(true);
      }}
      className="cursor-pointer w-full bg-white hover:bg-slate-300 h-7 flex justify-center items-center rounded-xl border"
    >
      +
    </div>
  );
}

function ManageNetworks() {
  const [addNetworksForm, setAddNetworksForm] = useState<any>(true);
  return (
    <div className="flex gap-3">
      <div className="w-fit flex flex-col gap-3">
        <ShowNetworks />
        <AddNetworksToggle setAddNetworksForm={setAddNetworksForm} />
      </div>
      {addNetworksForm ? <AddNetworks /> : <EditNetworks />}
    </div>
  );
}

export default ManageNetworks;
