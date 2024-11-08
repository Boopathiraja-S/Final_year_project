import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import moment from 'moment';
import displayINRCurrency from '../helpers/displayCurrency';

const OrderPage = () => {

  const [data, setData] = useState([])

  const fetchOrderDetails = async () => {
    const response = await fetch(SummaryApi.getOrder.url, {
      method: SummaryApi.getOrder.method,
      credentials: "include"
    })

    const responseData = await response.json()

    setData(responseData.data)
    console.log("order list", responseData);
  }

  useEffect(() => {
    fetchOrderDetails()
  }, [])

  return (
    <div>
      {
        !data[0] && (
          <p>No Order available</p>
        )
      }

      <div className='p-4 w-full'>
        {
          data.map((item, index) => {
            return (
              <div key={item.userId + index}>
                <p className='font-medium text-lg mt-2'>{moment(item.createdAt).format("LL")}</p>

                <div className='border rounded'>

                  <div className='flex flex-col lg:flex-row justify-between'>

                    <div className='grid gap-1'>
                      {
                        item?.productDetails.map((product, index) => {
                          return (
                            <div key={product.productId + index} className='flex gap-3 bg-white rounded m-2'>
                              <img
                                src={product.image[0]}
                                className='w-28 h-28 self-center mix-blend-multiply hover:scale-110 object-scale-down m-2'
                              />
                              <div className='mt-5 lg:mt-2'>

                                <div className='font-medium md:text-lg text-ellipsis line-clamp-1'>{product.name}</div>
                                <div className='flex flex-col md:flex-row items-center md:gap-5 mt-2'>

                                  <div className='md:text-lg text-green-600 font-medium'>{displayINRCurrency(product.price)}</div>
                                  <p >Quantity : {product.quantity}</p>

                                </div>

                              </div>
                            </div>
                          )
                        })
                      }
                    </div>

                    <div className='flex flex-col gap-4 p-2 min-w-[300px]'>
                      <div>

                        <div className='text-lg font-medium'>Payment Details : </div>
                        <p className='ml-1'>Payment method : {item.paymentDetails.payment_method_type[0]}</p>
                        <p className='ml-1'>Payment Status : {item.paymentDetails.payment_status}</p>
                      </div>

                      <div>

                        <div className='text-lg font-medium'>Shipping Details : </div>
                        {
                          item.shipping_options.map((shipping, index) => {
                            return (
                              <div key={shipping.shipping_rate} className='ml-1'>
                                Shipping Amount : {shipping.shipping_amount}
                              </div>
                            )
                          })
                        }
                      </div>

                    </div>
                  </div>

                  <div className='font-semibold text-red-600 ml-auto w-fit md:text-lg mr-2'>
                    Total Amount : {displayINRCurrency(item.totalAmount)}
                  </div>
                </div>

              </div>
            )
          })
        }

      </div>
    </div>
  )
}

export default OrderPage