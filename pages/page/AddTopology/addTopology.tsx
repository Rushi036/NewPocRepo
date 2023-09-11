import Topology from '@/pages/Components/Topology/Topology'
import React, { useState } from 'react'

function addTopology() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [rfInstance, setRfInstance] = useState<any>(null);
  function saveTopology(){
    alert('hi')
  }
  return (
    <form className='m-4'>
      <div className="text-xl px-4 border-b-2 border-slate-400 pb-2 flex justify-between items-center">
        <span>Add Topology</span>
      </div>
      <div className="mt-4 p-2 box-border w-full bg-white">
        <div className="flex flex-row justify-between px-2">
          <label htmlFor="">Topology Name :
            <input type="text" required className='border-slate-600 border-2 rounded ml-2 w-[10rem]' />
          </label>
          <label htmlFor="">Cloud :
            <select required className='border-slate-600 border-2 rounded ml-2 w-[10rem]' >
              <option value="" selected disabled>Select Cloud</option>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
            </select>
          </label>
        </div>
        <div className='relative overflow-hidden'>
          <Topology/>
        </div>
        <div className='mt-4 flex justify-end'>
          <button type='submit' onClick={saveTopology} className='bg-red-700 text-white px-6 py-2 rounded '>Save</button>
        </div>
      </div>
    </form>
  )
}

export default addTopology