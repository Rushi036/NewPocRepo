import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

export const GlobalFilterTable = ({ filter, setFilter } : any) => {
    return (
        <span style={{ height: '35px', width: 'fit-content',border: '1px solid #dddddd' }} className='rounded relative w-full overflow-hidden mb-2'>
            <input style={{paddingRight:'35px'}} className='h-full mb-4 py-1 pl-3' value={filter || ''}
                onChange={(e) => setFilter(e.target.value)}
            />
            <span style={{width: '35px'}} className='h-full absolute right-0 top-0 flex justify-center items-center' >
                <AiOutlineSearch />
            </span>
        </span>
    )
}
