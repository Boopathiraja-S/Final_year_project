import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SummaryApi from '../common'
import { RiStarFill } from "react-icons/ri";
import { RiStarHalfLine } from "react-icons/ri";
import displayINRCurrency from '../helpers/displayCurrency';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import Context from '../context';
import addToCart from '../helpers/addToCart';


const ProductDetails = () => {

  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  })

  const params = useParams()
  const [loading, setLoading] = useState(true)
  const productImageLoading = new Array(4).fill(null)
  const [activeImage, setActiveImage] = useState("")
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0
  })
  const [zoomImage, setZoomImage] = useState(false)

  const { fetchUserAddToCart } = useContext(Context)

  const navigate = useNavigate()

  const fetchProductDetails = async () => {
    setLoading(true)
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        productId: params?.id
      })
    })
    setLoading(false)

    const dataResponse = await response.json()

    setData(dataResponse?.data)
    setActiveImage(dataResponse?.data?.productImage[0])
  }

  console.log("data : ", data);


  useEffect(() => {
    fetchProductDetails()
  }, [params])

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL)
  }

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true)
    const { left, top, width, height } = e.target.getBoundingClientRect()

    console.log("coordinate", left, top, width, height);

    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height

    setZoomImageCoordinate({
      x,
      y
    })
  }, [zoomImageCoordinate])

  const handleLeaveImageZoom = () => {
    setZoomImage(false)
  }

  // add to cart fetch section
  const handleAddToCart = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart()
  }

  // buy product
  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart()
    navigate("/cart")
  }

  return (
    <div className='container mx-auto p-4'>

      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>

        {/* product image */}
        <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>

          <div className='h-[300px] w-[300px] lg:w-96 lg:h-96 bg-slate-200 relative p-3' >
            <img src={activeImage} className='h-full w-full object-scale-down mix-blend-multiply' onMouseMove={handleZoomImage} onMouseLeave={handleLeaveImageZoom}/>

            {/* product zoom */}
            {
              zoomImage && (
                <div className='hidden lg:block absolute min-w-[500px] min-h-[400px] overflow-hidden bg-slate-200 p-1 -right-[510px] top-0'>

                  <div
                    className='w-full h-full min-h-[400px] min-w-[400px] mix-blend-multiply scale-125'
                    style={{
                      backgroundImage: `url(${activeImage})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`
                    }}
                  >
                  </div>
                </div>
              )
            }

          </div>

          <div className='h-full'>
            {
              loading ?
                (
                  <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                    {
                      productImageLoading.map((el, index) => {
                        return (
                          <div className='h-20 w-20 bg-slate-200 rounded animate-pulse' key={"loadingImage" + index}>

                          </div>
                        )
                      })
                    }
                  </div>
                ) :
                (
                  <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                    {
                      data?.productImage?.map((imgURL, index) => {
                        return (
                          <div className='h-20 w-20 bg-slate-200 rounded p-1' key={imgURL}>
                            <img src={imgURL} className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' onMouseEnter={() => handleMouseEnterProduct(imgURL)} onClick={() => handleMouseEnterProduct(imgURL)} />
                          </div>
                        )
                      })
                    }
                  </div>
                )
            }
          </div>

        </div>


        {/* product details */}
        {
          loading ? (
            <div className='grid w-full gap-1'>
              <p className='bg-slate-300 text-white h-6 lg:h-8  animate-pulse rounded-full inline-block w-full'></p>
              <h2 className='text-2xl lg:text-4xl font-medium bg-slate-300 h-6 lg:h-8  w-full rounded-full animate-pulse'></h2>
              <p className=' text-slate-500 bg-slate-300 animate-pulse w-full h-6 lg:h-8  rounded-full'></p>

              <div className='bg-slate-300 h-6 lg:h-8  rounded-full animate-pulse text-xl flex items-center gap-1'>

              </div>

              <div className='flex items-center gap-4 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8 animate-pulse'>
                <p className='w-full bg-slate-300 rounded-full'></p>
                <p className='w-full bg-slate-300 rounded-full'></p>
              </div>

              <div className='flex items-center gap-3 my-4'>
                <p className='h-6 lg:h-8  w-full bg-slate-300 rounded-full animate-pulse'></p>
                <p className='h-6 lg:h-8  w-full bg-slate-300 rounded-full animate-pulse'></p>
              </div>

              <div className='w-full gap-3 my-2 flex flex-col '>
                <p className='h-6 lg:h-8 w-full bg-slate-300 rounded-full animate-pulse'></p>
                <p className='h-10 lg:h-12  w-full bg-slate-300 rounded-full animate-pulse'></p>
              </div>

            </div>
          )
            :
            (
              <div className='flex flex-col gap-1'>
                <p className='bg-gray-600 text-white px-2 lg:px-4 rounded-full capitalize inline-block w-fit'>{data?.brandName}</p>
                <h2 className='text-2xl lg:text-4xl font-medium capitalize'>{data?.productName}</h2>
                <p className='capitalize text-slate-500'>{data?.category}</p>

                <div className='text-green-500 text-xl flex items-center gap-1'>
                  <RiStarFill />
                  <RiStarFill />
                  <RiStarFill />
                  <RiStarFill />
                  <RiStarHalfLine />
                </div>

                <div className='flex items-center gap-4 text-2xl lg:text-3xl font-medium my-1'>
                  <p className='text-green-600'>{displayINRCurrency(data.sellingPrice)}</p>
                  <p className='text-red-500 line-through'>{displayINRCurrency(data.price)}</p>
                </div>

                <div className='flex items-center gap-3 my-2'>
                  <button className='border-2 border-green-600 px-3 py-1 min-w-[120px] text-green-600 font-medium hover:text-white hover:bg-green-800 rounded' onClick={(e) => handleBuyProduct(e, data?._id)} >Buy</button>
                  <button className='border-2 border-gray-700 px-3 py-1 min-w-[120px]  font-medium text-white bg-gray-700 hover:text-black hover:bg-slate-100 rounded' onClick={(e) => handleAddToCart(e, data?._id)}>Add to cart</button>
                </div>

                <div>
                  <p className='text-slate-600 font-medium my-1'>Description : </p>
                  <p>{data?.description}</p>
                </div>

              </div>
            )
        }


      </div>

      {
        data.category && (
          <CategoryWiseProductDisplay category={data?.category} heading={"Recommended Products"} />

        )
      }

    </div>
  )
}

export default ProductDetails