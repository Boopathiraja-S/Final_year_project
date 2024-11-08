import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SummaryApi from '../common';
import VerticalCart from '../components/VerticalCart';

const SearchProduct = () => {

  const query = useLocation()
  const [data, setData] = useState([])
  const [loading, SetLoading] = useState(false)

  console.log("query", query.search);

  const fetchProduct = async () => {
    SetLoading(true)
    const response = await fetch(SummaryApi.searchProduct.url + query.search)
    const dataResponse = await response.json()
    SetLoading(false)

    setData(dataResponse.data)

  }

  useEffect(() => {
    fetchProduct()
  },[query])

  return (
    <div className='container mx-auto p-4'>
      {
        loading && (
          <p className='text-lg text-center'>Loading...</p>
        )
      }

      <p className='text-lg font-semibold my-3 text-red-600'>Search Result : {data.length}</p>

      {
        data.length === 0 && !loading && (
          <p className='bg-white text-lg text-center p-4'>No Data Found...</p>
        )
      }

      {
        data.length !== 0 && !loading && (
          <VerticalCart loading={loading} data={data} />
        )
      }

    </div>
  )
}

export default SearchProduct