import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { AiFillDelete } from "react-icons/ai";
import { loadStripe } from '@stripe/stripe-js';

const Cart = () => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(context.cartProductCount).fill(null)

    const fetchData = async () => {

        const response = await fetch(SummaryApi.addToCartProductView.url, {
            method: SummaryApi.addToCartProductCount.method,
            credentials: 'include',
            headers: {
                "content-type": " application/json"
            }
        })

        const responseData = await response.json()

        if (responseData.success) {
            setData(responseData.data)
        }
    }

    const handleLoading = async () => {
        await fetchData()
    }

    useEffect(() => {
        setLoading(true)
        handleLoading()
        setLoading(false)
    }, [])

    // increase quantity
    const increaseQty = async (id, qty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(
                {
                    _id: id,
                    quantity: qty + 1
                }
            )
        })

        const responseData = await response.json()

        if (responseData.success) {
            fetchData()
        }
    }

    // decrease quantity
    const decreaseQty = async (id, qty) => {
        if (qty >= 2) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(
                    {
                        _id: id,
                        quantity: qty - 1
                    }
                )
            })

            const responseData = await response.json()

            if (responseData.success) {
                fetchData()
            }
        }
    }

    // delete product in cart
    const deleteCartProduct = async (id) => {
        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(
                {
                    _id: id,
                }
            )
        })

        const responseData = await response.json()

        if (responseData.success) {
            fetchData()
            context.fetchUserAddToCart()

        }
    }

    const handlePayment = async () => {

        const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

        const response = await fetch(SummaryApi.payment.url, {
            method: SummaryApi.payment.method,
            credentials: "include",
            headers: {
                "content-type": " application/json"
            },
            body: JSON.stringify({
                cartItems: data
            })
        })

        const responseData = await response.json()

        if (responseData?.id) {
            stripePromise.redirectToCheckout({ sessionId: responseData.id })
        }

        console.log(" payment responseData : ", responseData);

    }

    const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)
    const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0)

    return (
        <div className='container mx-auto'>

            <div className='text-center text-lg my-3'>
                {
                    data.length === 0 && !loading && (
                        <p className='bg-white py-5 text-red-600 font-semibold'>No Product is available please pick your products</p>
                    )
                }
            </div>


            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
                {/* view Product */}
                <div className='w-full max-w-3xl'>
                    {
                        loading ?
                            (
                                loadingCart.map((el, index) => {
                                    return (
                                        <div key={el + "Add to Cart Loading" + index}
                                            className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'>
                                        </div>
                                    )
                                })
                            )
                            :
                            (
                                data.map((product, index) => {
                                    return (
                                        <div key={product?._id + "Add to Cart Loading"}
                                            className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>

                                            <div className='w-32 h-32 p-2 bg-slate-200'>
                                                <img src={product?.productId?.productImage[0]}
                                                    className='w-full h-full object-scale-down mix-blend-multiply'
                                                />
                                            </div>

                                            <div className='px-4 py-2 relative'>

                                                {/* delete button */}
                                                <div
                                                    className='absolute text-xl right-1 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer'
                                                    onClick={() => deleteCartProduct(product?._id)}
                                                >
                                                    <AiFillDelete />
                                                </div>
                                                <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1 capitalize'>{product?.productId?.productName}</h2>
                                                <p className='text-xs font-medium text-gray-500 capitalize'>{product?.productId?.category}</p>

                                                <div className='flex items-center justify-between'>
                                                    <p className='font-medium md:text-lg text-slate-600'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                                    <p className='font-medium md:text-lg text-green-600'>{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                                </div>

                                                <div className='flex items-center gap-3 mt-2'>
                                                    <button className='border border-red-600 text-red-600 w-6 h-6 hover:bg-red-600 hover:text-white flex justify-center items-center rounded' onClick={() => decreaseQty(product?._id, product?.quantity)} >-</button>
                                                    <span>{product?.quantity}</span>
                                                    <button className='border border-red-600 text-red-600 w-6 h-6 hover:bg-red-600 hover:text-white flex justify-center items-center rounded' onClick={() => increaseQty(product?._id, product?.quantity)} >+</button>
                                                </div>
                                            </div>

                                        </div>
                                    )
                                })
                            )
                    }
                </div>

                {/* Summary */}
                {
                    data[0] && (
                        <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                            {
                                loading ?
                                    (
                                        <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse rounded'>
                                        </div>
                                    ) :
                                    (
                                        <div className='h-36 bg-white rounded'>
                                            <h2 className='text-white bg-green-600 px-4 py-1 text-center rounded'>Summary</h2>

                                            <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600' >
                                                <p>Quantity : </p>
                                                <p>{totalQty}</p>
                                            </div>

                                            <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                                <p  >total Price : </p>
                                                <p>{displayINRCurrency(totalPrice)}</p>
                                            </div>

                                            <button className='bg-blue-600 text-white w-full mt-2 p-2' onClick={handlePayment}>Confirm Order</button>
                                        </div>
                                    )
                            }
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default Cart