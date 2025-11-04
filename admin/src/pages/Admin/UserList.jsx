import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'

const UserList = () => {

  const { aToken , patients, getAllPatients} = useContext(AdminContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (aToken) {
      getAllPatients()
      setLoading(false)
    }
}, [aToken])

  return (
    <div className='w-full m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Users</h1>
      {
        loading ? (
          <div className='w-full h-[70vh] flex justify-center items-center'>
            <div className='animate-spin rounded-full h-11 w-11 border-3 border-purple-500 border-t-transparent'></div>
          </div>
        ): (
          <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
            {patients.map((item, index) => (
              <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
                <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
                <div className='p-4'>
                  <p className='text-[#262626] dark:text-neutral-200 text-lg font-medium'>{item.name}</p>
                  <p className='text-[#5C5C5C] dark:text-gray-300 text-sm'>{item.gender}</p>
                  <p className='text-[#5C5C5C] dark:text-gray-400 text-sm'>{item.dob}</p>
                  <p className='text-[#5C5C5C] dark:text-zinc-500 text-sm'>{item.address.line1 || "No address"} <br /> {item.address.line2 || "No address"}</p>

                </div>
              </div>
            ))}
          </div>
        )
      }
      
    </div>
  )
}

export default UserList;