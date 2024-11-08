import React, { useState } from 'react'
import ROLE from '../common/role'
import { IoCloseSharp } from "react-icons/io5";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const ChangeUserRole = ({
    userId,
    name,
    email,
    role,
    onClose,
    callFunc
}) => {

    const [userRole, setUserRole] = useState(role)
    
    const handleOnChangeSelect = (e) => {
        setUserRole(e.target.value)

        console.log(e.target.value);
        
    }

    const updateUserRole = async () => {
        const fetchResponse = await fetch(SummaryApi.updateUser.url, {
            method: SummaryApi.updateUser.method,
            credentials: 'include',
            headers: {
                "content-type":"application/json"
            },
            body: JSON.stringify({
                userId:userId,
                role:userRole
            })
        })


        const responseData = await fetchResponse.json()

        if (responseData.success) {
            toast.success(responseData.message)
            onClose()
            callFunc()
        }

        console.log("Role updated", responseData);
        
    }

    return (
      
        <div className='fixed w-full h-full top-0 bottom-0 right-0 left-0 z-10 flex items-center justify-between bg-slate-200 bg-opacity-50'>
            <div className='mx-auto bg-white shadow-md p-4 w-full max-w-sm'>
                
                <button className='block ml-auto text-lg rounded-full hover:bg-red-600 hover:text-white' onClick={onClose}>
                    <IoCloseSharp />
               </button>

              <h1 className='pb-4 text-lg font-medium'>Change User Role</h1>

              <p>Name: {name}</p>
              <p>Email: {email}</p>

              <div className='flex items-center justify-between my-4'>
                  <p>Role :</p>
                  <select className='border px-4 py-1' value={userRole} onChange={handleOnChangeSelect}>
                      {
                          Object.values(ROLE).map(el => {
                              return (
                                  <option value={el} key={el}>{el}</option>
                              )
                          })
                      }
                  </select>
              </div>
                <button className='w-fit mx-auto block py-1 px-5 rounded-full bg-black text-white hover:bg-gray-800' onClick={updateUserRole}>Change Role</button>
          </div>
    </div>
  )
}

export default ChangeUserRole