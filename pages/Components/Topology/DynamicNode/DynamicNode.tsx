import { memo, useCallback, useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Handle, Position } from 'reactflow';
import Modal from 'react-modal';

const handleStyle = { left: 10 };

const memoTopo = ((data: any) => {
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
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onDelete = useCallback(() => {
    let id = data.id;
    deleteElements({ nodes: [{ id }] });
  }, [data.id, deleteElements]);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000
    },
  };

  return (
    <>
      {data.id === '0' ? '' : <Handle type="target" position={Position.Top} />}
      {data.id === '0' ?
        (
          <div className='custom-node' onClick={openModal}>
            {data.id === '0' ? '' : <button onClick={onDelete}>x</button>}
            <img src={data.data.Path.Path} alt="" />
            <p>{data.data.Path.Name}</p>
          </div>
        )
        :
        (
          <div className='custom-node'>
            {data.id === '0' ? '' : <button onClick={onDelete}>x</button>}
            <img src={data.data.Path.Path} alt="" />
            <p>{data.data.Path.Name}</p>
          </div>
        )
      }
      <Handle type="source" position={Position.Bottom} id="a" />
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
        <button onClick={closeModal}>close</button>
        <form>
          <input type='text' placeholder='name' />
          <input type='text' placeholder='name' />
          <input type='text' placeholder='name' />
          <input type='text' placeholder='name' />
          <input type='text' placeholder='name' />
          <input type='text' placeholder='name' />
        </form>
      </Modal>
    </>
  );
})
export default memoTopo;
