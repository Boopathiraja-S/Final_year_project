import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import addToCart from '../helpers/addToCart';
import { Link } from 'react-router-dom';
import Context from '../context';

const VerticalCardProduct = ({ category, heading }) => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const loadingList = new Array(13).fill(null)

    const [scroll, setScroll] = useState(0)
    const scrollElement = useRef()


    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async (e, id) => {
        await addToCart(e, id)
        fetchUserAddToCart()
    }

    const fetchData = async () => {
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)

        console.log("vertical data : ", categoryProduct.data);


        setData(categoryProduct?.data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const scrollRight = () => {
        scrollElement.current.scrollLeft += 300
    }

    const scrollLeft = () => {
        scrollElement.current.scrollLeft -= 300

    }

    return (
        <div className='container mx-auto px-4 my-6 relative'>

            <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

            <div className='flex rounded items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all' ref={scrollElement}>

                <button className='bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block hover:bg-slate-800 hover:text-white' onClick={scrollLeft}><FaAngleLeft /></button>
                <button className='bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block hover:bg-slate-800 hover:text-white' onClick={scrollRight}><FaAngleRight /></button>

                {
                    loading ?
                        (
                            loadingList.map((product, index) => {
                                return (
                                    <div className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded shadow' key={index}>

                                        <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse'>
                                        </div>
                                        <div className='p-4 grid gap-3'>
                                            <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black rounded-full bg-slate-200 animate-pulse p-1 py-3 w-full'></h2>
                                            <p className='capitalize text-slate-600 p-1 py-3 rounded-full bg-slate-200 animate-pulse'></p>
                                            <div className='flex gap-3'>
                                                <p className='text-green-700 font-medium rounded-full bg-slate-200 animate-pulse p-1 py-3 w-full'></p>
                                                <p className='text-red-500 line-through rounded-full bg-slate-200 animate-pulse p-1 py-3 w-full'></p>
                                            </div>
                                            <button className='text-sm text-white px-3 py-3 rounded-full bg-slate-200 animate-pulse w-full'></button>
                                        </div>

                                    </div>
                                )
                            })
                        ) : (

                            data.map((product, index) => {
                                return (
                                    <Link to={"product/" + product?._id} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded shadow' key={index}>

                                        <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center'>
                                            <img src={product.productImage[0]} className='object-scale-down h-full hover:scale-125 transition-all mix-blend-multiply' />
                                        </div>
                                        <div className='p-4 grid gap-3'>
                                            <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{product?.productName}</h2>
                                            <p className='capitalize text-slate-600'>{product?.category}</p>
                                            <div className='flex gap-3'>
                                                <p className='text-green-700 font-medium'>{displayINRCurrency(product?.sellingPrice)}</p>
                                                <p className='text-red-500 line-through'>{displayINRCurrency(product?.price)}</p>
                                            </div>
                                            <button className='text-sm bg-black text-white hover:bg-gray-800 px-3 py-1 rounded-full' onClick={(e) => handleAddToCart(e, product?._id)}>Add to cart</button>
                                        </div>

                                    </Link>
                                )
                            })
                        )
                }
            </div>

        </div>
    )
}

export default VerticalCardProduct