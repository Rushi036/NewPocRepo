import { addNetworkData, deleteNetworkData } from "@/pages/api/addNetwork";
import { getIcons, getIconsId } from "@/pages/api/getIcons";
import axios from "axios";
import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MdDelete, MdEdit } from "react-icons/md";

function AddNetworks({ updateNetworksList, setUpdateNetworksList }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<any>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [network_icons, setNetworkIcons] = useState<any>(null);
  const [networkTitle, setNetworkTitle] = useState<any>(null);
  const [networkParent, setNetworkParent] = useState<any>(null);
  useEffect(() => {
    async function dataFetch() {
      await getIcons().then((res: any) => {
        setNetworkIcons(res.data);
      });
    }
    dataFetch();
  }, [updateNetworksList]);

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;

    if (fileInput.files && fileInput.files[0]) {
      const selectedFile = fileInput.files[0];

      // Check if the selected file is a PNG file
      if (selectedFile.type === "image/png") {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (imageContainerRef.current) {
            imageContainerRef.current.style.backgroundImage = `url('${e.target?.result}')`;
          }
        };
        reader.readAsDataURL(selectedFile);
      } else {
        alert("Please select a PNG file.");
        fileInput.value = ""; // Clear the file input
      }
    }
  };

  async function addNetworkAPI(e: any) {
    e.preventDefault();
    if (networkTitle) {
      let networkData;
      let networkDataId;
      let newNetworkData = {
        Name: networkTitle,
        Path: "/network_icons/AWS.png",
      };
      if (networkParent) {
        networkData = network_icons
          .map((data: any) => {
            if (data.Name == networkParent) {
              networkDataId = data.id;
              let SubCategory: any = data.SubCategory
                ? [...data.SubCategory, newNetworkData]
                : [newNetworkData];
              return { ...data, SubCategory: SubCategory };
            }
          })
          .filter((x: any) => x != undefined);
        console.log(networkData);
      } else {
        networkData = [newNetworkData];
      }
      console.log("networkData", networkData);
      addNetworkData(
        networkData[0],
        networkDataId,
        networkParent ? "updateOld" : "addNew"
      ).then(() => {
        setUpdateNetworksList((prevValue: any) => !prevValue);
      });
    }
  }
  return (
    <div className="bg-white w-full p-3 rounded-xl">
      <h1>Add Network -</h1>
      <form action="">
        <div className="flex flex-row gap-5">
          <div
            onClick={handleDivClick}
            ref={imageContainerRef}
            className="cursor-pointer bg-center bg-cover bg-no-repeat w-[100px] h-[100px] flex justify-center items-center shadow-[inset_0_0_0_5px_white] bg-slate-200 text-slate-400 rounded border"
          ></div>
          <input
            type="file"
            name=""
            id="ImageInput"
            accept=".png"
            style={{ display: "none" }}
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <div className="flex flex-col">
            <label>Network Title</label>
            <input
              type="text"
              placeholder="Title"
              onBlur={(e: any) => setNetworkTitle(e.target.value)}
            />
            <label>Choose parent</label>
            <select
              name=""
              id=""
              onChange={(e: any) => setNetworkParent(e.target.value)}
            >
              <option value="">none</option>
              {network_icons &&
                network_icons.map((network_icon: any, i: any) => {
                  return (
                    <option value={network_icon.Name} key={i}>
                      {network_icon.Name}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
        <button
          onClick={addNetworkAPI}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Add
        </button>
      </form>
    </div>
  );
}

function EditNetworks({ currentEditNetwork, updateNetworksList }: any) {
  const [network_icons, setNetworkIcons] = useState<any>(null);
  const [network_icons_list, setNetworkIconsList] = useState<any>(null);
  const [data, setData] = useState<any>({});
  useEffect(() => {
    async function dataFetch() {
      await getIcons().then((res: any) => {
        setNetworkIcons(res.data[currentEditNetwork.mainNetworkPos]);
        setNetworkIconsList(res.data);
      });
    }
    dataFetch();
  }, [currentEditNetwork, updateNetworksList]);
  useEffect(() => {
    let name: any =
      currentEditNetwork?.childNetworkPos ||
      currentEditNetwork?.childNetworkPos === 0
        ? network_icons?.[0]?.SubCategory?.[currentEditNetwork.childNetworkPos]
            .Name
        : network_icons?.[0]?.Name;

    let parent: any =
      currentEditNetwork?.childNetworkPos ||
      currentEditNetwork?.childNetworkPos === 0
        ? network_icons?.[0]?.Name
        : "";
    setData({ Title: name, parent: parent });
  }, [network_icons]);
  return <div>editNetworks - </div>;
}

function ShowNetworks({
  updateNetworksList,
  setAddNetworksForm,
  setUpdateNetworksList,
  setCurrentEditNetwork,
}: any) {
  const [network_icons, setNetworkIcons] = useState<any>(null);
  useEffect(() => {
    async function dataFetch() {
      await getIcons().then((res: any) => {
        setNetworkIcons(res.data);
      });
    }
    dataFetch();
  }, [updateNetworksList]);

  function deleteNode(i: any, j: any, nodeId: any) {
    if (confirm("Are you sure you want to delete?")) {
      // console.log(i, j, nodeId);
      if (j == null) {
        deleteNetworkData(nodeId).then(() => {
          setUpdateNetworksList((prevValue: any) => !prevValue);
        });
      } else {
        let data: any = network_icons[i];
        let newData: any = {
          ...data,
          SubCategory: data.SubCategory.filter(
            (_: any, index: any) => index !== j
          ),
        };
        if (!newData.SubCategory[0]) {
          delete newData.SubCategory;
        }
        addNetworkData(newData, nodeId, "updateOld").then(() => {
          setUpdateNetworksList((prevValue: any) => !prevValue);
        });
      }
    }
  }

  return (
    <div className="w-[15rem] h-[70vh] overflow-auto flex flex-col gap-3">
      <div
        className={
          "editor-options min-h-[50vh] overflow-y-auto bg-white rounded-xl !p-3"
        }
      >
        <h4 className="mb-2">Newtorks -</h4>
        <div className="modal" style={{ display: "contents" }}>
          <ul>
            {network_icons &&
              network_icons.map((x: any, i: any) => {
                return (
                  <li key={i} className={"flex !flex-col mt-5"}>
                    <div className="flex gap-2 justify-between items-center">
                      <div className="flex gap-2">
                        <img src={x.Path} /> <p>{x.Name}</p>
                      </div>
                      {!x?.SubCategory && (
                        <div className="flex gap-2">
                          <div
                            onClick={() => deleteNode(i, null, x.id)}
                            className="cursor-pointer p-1 text-slate-400 hover:text-red-500"
                          >
                            <MdDelete />
                          </div>
                          <div
                            onClick={() => {
                              setAddNetworksForm(false);
                              setCurrentEditNetwork({
                                mainNetworkId: x.id,
                                mainNetworkPos: i,
                              });
                            }}
                            className="cursor-pointer p-1 text-slate-400 hover:text-blue-500"
                          >
                            <MdEdit />
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className={
                        x?.SubCategory
                          ? "flex flex-col border-l ml-3"
                          : "flex flex-col"
                      }
                    >
                      {x?.SubCategory?.map((y: any, j: any) => {
                        return (
                          <div
                            key={j}
                            className={
                              "flex gap-2 ml-1 my-1 justify-between items-center"
                            }
                          >
                            <div className="flex gap-2">
                              <img key={j} src={y.Path} /> <p>{y.Name}</p>
                            </div>
                            <div className="flex gap-2">
                              <div
                                onClick={() => deleteNode(i, j, x.id)}
                                className="cursor-pointer p-1 text-slate-400 hover:text-red-500"
                              >
                                <MdDelete />
                              </div>
                              <div
                                onClick={() => {
                                  setAddNetworksForm(false);
                                  setCurrentEditNetwork({
                                    mainNetworkId: x.id,
                                    mainNetworkPos: i,
                                    childNetworkPos: j,
                                  });
                                }}
                                className="cursor-pointer p-1 text-slate-400 hover:text-blue-500"
                              >
                                <MdEdit />
                              </div>
                            </div>
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
  const [updateNetworksList, setUpdateNetworksList] = useState<any>(true);
  const [currentEditNetwork, setCurrentEditNetwork] = useState<any>({});
  return (
    <div className="flex gap-3">
      <div className="w-fit flex flex-col gap-3">
        <ShowNetworks
          updateNetworksList={updateNetworksList}
          setAddNetworksForm={setAddNetworksForm}
          setUpdateNetworksList={setUpdateNetworksList}
          setCurrentEditNetwork={setCurrentEditNetwork}
        />
        <AddNetworksToggle setAddNetworksForm={setAddNetworksForm} />
      </div>
      {addNetworksForm ? (
        <AddNetworks
          setUpdateNetworksList={setUpdateNetworksList}
          updateNetworksList={updateNetworksList}
        />
      ) : (
        <EditNetworks currentEditNetwork={currentEditNetwork} />
      )}
    </div>
  );
}

export default ManageNetworks;
