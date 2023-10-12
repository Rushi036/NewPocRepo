import { memo, useCallback, useState } from "react";
import { useReactFlow } from "reactflow";
import { Handle, Position } from "reactflow";
import Modal from "react-modal";
import Link from "next/link";

const handleStyle = { left: 10 };

const memoTopo = (data: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [dialogOpen, setDialogOpen] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
  });

  // const handleChange = (e: any) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  const handleSubmit = (e: any) => {
    setDialogOpen(false);
    // e.preventDefault();
    // You can perform actions with formData here, like sending it to an API or updating state.
    // console.log("Form data submitted:", formData);
  };
  let subtitle: any;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { deleteElements } = useReactFlow();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onDelete = useCallback(() => {
    let id = data.id;
    deleteElements({ nodes: [{ id }] });
  }, [data.id, deleteElements]);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);

  }
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1000,
    },
  };

  return (
    <>
      {data.id === "0" ? "" : <Handle type="target" position={Position.Top} />}
      {data.id === "0" ? (
        <div className="custom-node" onClick={openModal}>
          {/* {data.id === "0" ? <button onClick={()=>setDialogOpen(true)}>+</button> : <button onClick={onDelete}>x</button>} */}
          <img height={100} width={100} src={data.data?.Path?.Path} alt="" />
          <p>{data.data?.Path?.Name}</p>
        </div>
      ) : (
        <div className="custom-node">
          {/* {data.id === "0" ? <button onClick={()=>setDialogOpen(true)}>+</button> : <button onClick={onDelete}>x</button>} */}
          <img height={100} width={100}  src={data.data?.Path?.Path} alt="" />
          <p>{data.data?.Path?.Name}</p>
        </div>
      )}

      {/* {dialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white border-2 border-gray-600 px-7 py-4 rounded-lg shadow-xl">
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="firstName">Input 1:</label>
                <input
                  type="text"
                  id="input1"
                  name="input1"
                  value={formData.input1}
                  // onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName">Input 2:</label>
                <input
                  type="text"
                  id="input2"
                  name="input2"
                  value={formData.input2}
                  // onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email">Input 3:</label>
                <input
                  type="email"
                  id="input3"
                  name="input3"
                  value={formData.input3}
                  // onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password">Input 4:</label>
                <input
                  type="password"
                  id="input4"
                  name="input4"
                  value={formData.input4}
                  // onChange={handleChange}
                />
              </div>
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )} */}
      <Handle type="source" position={Position.Bottom} id="a" />
      {/* <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
        <button onClick={closeModal}>close</button>
        <form>
          <input type="text" placeholder="name" />
          <input type="text" placeholder="name" />
          <input type="text" placeholder="name" />
          <input type="text" placeholder="name" />
          <input type="text" placeholder="name" />
          <input type="text" placeholder="name" />
        </form>
      </Modal> */}
    </>
  );
};
export default memoTopo;
