import React from 'react'
import CANCELIMAGE from '../assest/cancel.gif';
import { Link } from 'react-router-dom';

const Cancel = () => {
  return (
    <div className='bg-slate-200 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 m-2 mt-8 rounded'>

      <img
        src={CANCELIMAGE}
        width={150}
        height={150}
      />
      <p className='text-red-600 font-bold text-xl mt-2'>Payment Failed</p>
      <Link to={"/cart"} className='p-2 px-3 mt-5 bg-red-700 hover:bg-red-500 text-white rounded'>Go To Cart</Link>
    </div>
  )
}

export default Cancel