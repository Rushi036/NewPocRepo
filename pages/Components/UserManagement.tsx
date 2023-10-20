import React, { useEffect, useState } from "react";
import { tableData } from "../api/tableData";
import Link from "next/link";
import { getAllTopo } from "../api/getAllTopo";
import CloseIcon from "@mui/icons-material/Close";
import AddBoxIcon from "@mui/icons-material/AddBox";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const UserManagement = () => {
  const [data, setData] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<any>(false);

  const [userData, setUserData] = useState({
    businessName: "",
    ownerName: "",
    ownerEmail: "",
    role: "BE",
  });
  const [contactDetails, setContactDetails] = useState<any>([
    { contactName: "", contactEmail: "" },
  ]);

  const [subscriptionDetail, setSubscriptionDetail] = useState<any>([
    { cloud: "", subsAccName: "", subsAccId: "" },
  ]);

  const isFormValid = () => {
    const isBusinessNameValid = userData.businessName.trim() !== "";
    const isOwnerNameValid = userData.ownerName.trim() !== "";
    const isOwnerEmailValid = userData.ownerEmail.trim() !== "";
    const areContactDetailsValid = contactDetails.every(
      (contact: any) =>
        contact.contactName.trim() !== "" && contact.contactEmail.trim() !== ""
    );
    const areSubscriptionDetailsValid = subscriptionDetail.every(
      (subscription: any) =>
        subscription.cloud.trim() !== "" &&
        subscription.subsAccName.trim() !== "" &&
        subscription.subsAccId.trim() !== ""
    );

    return (
      isBusinessNameValid &&
      isOwnerNameValid &&
      isOwnerEmailValid &&
      areContactDetailsValid &&
      areSubscriptionDetailsValid
    );
  };

  const handleUserDataChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleContactChange = (index: any, event: any) => {
    const updatedContacts = [...contactDetails];
    updatedContacts[index][event.target.name] = event.target.value;
    setContactDetails(updatedContacts);
  };

  const handleSubscriptionChange = (index: any, event: any) => {
    const updatedSubscriptions = [...subscriptionDetail];
    updatedSubscriptions[index][event.target.name] = event.target.value;
    setSubscriptionDetail(updatedSubscriptions);
  };

  const handleAddContact = () => {
    setContactDetails([
      ...contactDetails,
      { contactName: "", contactEmail: "" },
    ]);
  };

  const handleAddSubscription = () => {
    setSubscriptionDetail([
      ...subscriptionDetail,
      { cloud: "", subsAccName: "", subsAccId: "" },
    ]);
  };

  const handleRemoveContact = (index: any) => {
    const updatedContacts = [...contactDetails];
    updatedContacts.splice(index, 1);
    setContactDetails(updatedContacts);
  };
  const handleRemoveSubscription = (index: any) => {
    const updatedSubscriptions = [...subscriptionDetail];
    updatedSubscriptions.splice(index, 1);
    setSubscriptionDetail(updatedSubscriptions);
  };

  useEffect(() => {
    dataFetch();
  }, []);
  async function dataFetch() {
    // const res: any = await getAllTopo();
    // setData(res.data.sort());
  }

  const handleUpload = () => {
    console.log("userdata", userData);
    console.log("subscription", subscriptionDetail);
    console.log("contact", contactDetails);

    const formData = {
      businessName: userData.businessName,
      ownerName: userData.ownerName,
      ownerEmail: userData.ownerEmail,
      role: userData.role,
      contactDetails: contactDetails.map((contact: any) => ({
        contactName: contact.contactName,
        contactEmail: contact.contactEmail,
      })),
      subscriptionDetail: subscriptionDetail.map((subscription: any) => ({
        cloud: subscription.cloud,
        subsAccName: subscription.subsAccName,
        subsAccId: subscription.subsAccId,
      })),
    };

    console.log("payload", formData);
  };

  // console.log("All Topo Data", data);
  return (
    <div className="">
      <div className="text-xl px-4 border-b-2 border-slate-400 pb-2 flex justify-between items-center">
        <span>User Management</span>
      </div>
      <div className="flex justify-between px-4">
        <div></div>
        <button
          onClick={() => setIsOpen(true)}
          className="btn bg-red-700 rounded-sm  px-4 py-1 mt-6 text-white font-semibold hover:bg-red-800"
        >
          Add User
        </button>
      </div>
      <div className="items-center pb-4 px-4 ">
        <div className="relative overflow-x-auto mt-6">
          <table className="w-full text-sm text-center text-gray-800 ">
            <thead className="text-xs text-white uppercase bg-red-800 ">
              <tr>
                <th scope="col" className="px-auto py-3">
                  Sr.No.
                </th>
                <th scope="col" className="px-auto py-3">
                  Business Name
                </th>
                <th scope="col" className="px-auto py-3">
                  Owner Name
                </th>
                <th scope="col" className="px-auto py-3">
                  Owner Email
                </th>
                <th scope="col" className="px-auto py-3">
                  Contact Name
                </th>
                <th scope="col" className="px-auto py-3">
                  Contact Email
                </th>
                <th scope="col" className="px-auto py-3">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {/* {data && data.length != 0 ? (
                data.map((d: any, i: any) => {
                  return (
                    <tr key={i} className="bg-white border-b text-center">
                     <td className="px-auto py-3">{i + 1}</td>
                      <td className="px-auto py-3">{d.bu}</td>
                      <td className="px-auto py-3">{d.title}</td>
                      <td className="px-auto py-3">{d.status}</td>
                      {d.cloud_server && d.cloud_server.length > 1 ? (
                        <td className="px-auto py-3">
                          {d.cloud_server[0]} {d.cloud_server[1]}
                        </td>
                      ) : (
                        <td className="px-auto py-3">{d.cloud_server}</td>
                      )}
                      <td className="px-auto py-3">{d.created_date}</td>
                      <td className="px-auto py-3 space-x-2">
                     
                      </td> 
                    </tr>
                  );
                })
              ) : (
                <tr className="bg-white border-b text-center ">
                  <td className="px-auto py-3 " colSpan={7}>
                    No Data Found
                  </td>
                </tr>
              )} */}
              <tr className="bg-white border-b text-center">
                {" "}
                <td className="px-auto py-3">1</td>
                <td className="px-auto py-3">ABMCPL</td>
                <td className="px-auto py-3">Prashant Agarwal</td>
                <td className="px-auto py-3">prashant.a@adityabirla.com</td>
                <td className="px-auto py-3">Sanket Doshi</td>
                <td className="px-auto py-3">sanket.doshi@adityabirla.com</td>
                <td className="px-auto py-3 text-blue-500">View Details</td>
              </tr>
              <tr className="bg-white border-b text-center">
                {" "}
                <td className="px-auto py-3">2</td>
                <td className="px-auto py-3">Birla Carbon</td>
                <td className="px-auto py-3">Ilango Nadar</td>
                <td className="px-auto py-3">s.ilanngo@adityabirla.com</td>
                <td className="px-auto py-3">Sourabh Mane</td>
                <td className="px-auto py-3">Sourabh.Mane@adityabirla.com</td>
                <td className="px-auto py-3 text-blue-500">View Details</td>
              </tr><tr className="bg-white border-b text-center">
                {" "}
                <td className="px-auto py-3">3</td>
                <td className="px-auto py-3">BMCSL</td>
                <td className="px-auto py-3">Prashant Pandit</td>
                <td className="px-auto py-3">prashant.pandit@adityabirla.com</td>
                <td className="px-auto py-3">Rajit Bhat</td>
                <td className="px-auto py-3">rajit.bhat@adityabirla.com</td>
                <td className="px-auto py-3 text-blue-500">View Details</td>
              </tr><tr className="bg-white border-b text-center">
                {" "}
                <td className="px-auto py-3">4</td>
                <td className="px-auto py-3">BMCSPL</td>
                <td className="px-auto py-3">Vikas Moon</td>
                <td className="px-auto py-3">Vikas.Moon@adityabirla.com</td>
                <td className="px-auto py-3">Rajit Bhat</td>
                <td className="px-auto py-3">rajit.bhat@adityabirla.com</td>
                <td className="px-auto py-3 text-blue-500">View Details</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* --------------------Add user Modal Start----------------------*/}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-3xl mx-auto my-12 bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-red-800 px-4 py-2 flex items-center justify-between">
                <h3 className="text-xl text-white font-bold">Add New User</h3>
                <button
                  className="p-2 text-2xl text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-lg font-semibold mb-2">
                    Business Name :
                  </label>
                  <input
                    name="businessName"
                    type="text"
                    placeholder="Type here"
                    value={userData.businessName}
                    className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                    onChange={handleUserDataChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-lg font-semibold mb-2">
                      Owner Name :
                    </label>
                    <input
                      name="ownerName"
                      type="text"
                      placeholder="Type here"
                      value={userData.ownerName}
                      className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                      onChange={handleUserDataChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-2">
                      Owner Email :
                    </label>
                    <input
                      name="ownerEmail"
                      type="email"
                      placeholder="Type here"
                      value={userData.ownerEmail}
                      className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                      onChange={handleUserDataChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-lg font-semibold mb-2">
                    Contact Details :
                  </label>
                  {contactDetails &&
                    contactDetails.map((contact: any, index: any) => (
                      <div className="grid grid-cols-2 gap-4 mb-2" key={index}>
                        <input
                          type="text"
                          name="contactName"
                          value={contact.contactName}
                          onChange={(event) =>
                            handleContactChange(index, event)
                          }
                          placeholder="Contact Name"
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          required
                        />
                        <input
                          type="email"
                          name="contactEmail"
                          value={contact.contactEmail}
                          onChange={(event) =>
                            handleContactChange(index, event)
                          }
                          placeholder="Contact Email"
                          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                          required
                        />
                      </div>
                    ))}
                  <div className="mb-6 flex items-center justify-end">
                    {contactDetails.length > 1 && (
                      <button
                        onClick={() =>
                          handleRemoveContact(contactDetails.length - 1)
                        }
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <RemoveCircleOutlineIcon />
                      </button>
                    )}
                    <button
                      onClick={handleAddContact}
                      className="text-blue-500 px-1 py-1 hover:text-blue-700"
                    >
                      <AddCircleOutlineIcon />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Subscription Details :
                  </label>
                  {subscriptionDetail.map((subscription: any, index: any) => (
                    <div className="grid grid-cols-3 gap-4 mb-2" key={index}>
                      <select
                        name="cloud"
                        value={subscription.cloud}
                        onChange={(event) =>
                          handleSubscriptionChange(index, event)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                        required
                      >
                        <option value="" disabled>
                          Select Cloud
                        </option>

                        <option value="Azure">Azure</option>
                        <option value="AWS">AWS</option>
                      </select>

                      <input
                        type="text"
                        name="subsAccName"
                        value={subscription.subsAccName}
                        onChange={(event) =>
                          handleSubscriptionChange(index, event)
                        }
                        placeholder="Subscription Account Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                        required
                      />
                      <input
                        type="text"
                        name="subsAccId"
                        value={subscription.subsAccId}
                        onChange={(event) =>
                          handleSubscriptionChange(index, event)
                        }
                        placeholder="Subscription Account ID"
                        className="w-full px-4 py-2 border border-gray-300 rounded shadow"
                        required
                      />
                    </div>
                  ))}
                  <div className="mb-6 flex items-center justify-end">
                    {subscriptionDetail.length > 1 && (
                      <button
                        onClick={() =>
                          handleRemoveSubscription(
                            subscriptionDetail.length - 1
                          )
                        }
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <RemoveCircleOutlineIcon />
                      </button>
                    )}
                    <button
                      onClick={handleAddSubscription}
                      className="text-blue-500 px-1 py-1 hover:text-blue-700"
                    >
                      <AddCircleOutlineIcon />
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-200 px-4 py-3 flex justify-end">
                <button
                  onClick={handleUpload}
                  className={` text-white px-6 py-2 rounded ${
                    isFormValid()
                      ? "bg-red-800 hover:bg-red-900"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!isFormValid()}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
