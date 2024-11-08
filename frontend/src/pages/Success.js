import React from 'react'
import SUCCESSIMAGE from '../assest/sucess.gif';
import {Link} from 'react-router-dom'

const Success = () => {
  return (
    <div className='bg-slate-200 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 m-2 mt-8 rounded'>

      <img
        src={SUCCESSIMAGE}
        width={150}
        height={150}
      />
      <p className='text-green-600 font-bold text-xl mt-2'>Payment Success</p>
      <Link to={"/order"} className='p-2 px-3 mt-5 bg-black hover:bg-gray-600 text-white rounded'>Go To Order</Link>
    </div>
  )
}

export default Success