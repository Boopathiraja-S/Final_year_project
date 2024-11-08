import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import loginIcons from "../assest/signin.gif";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    ConfirmPassword: "",
    profilePic: ""
  })

  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value.trim()
      }
    })
  }

  const handleUploadPic = async (e) => {
    const file = e.target.files[0]

    const imagePic = await imageTobase64(file)

    setData((preve) => {
      return {
        ...preve,
        profilePic: imagePic
      }
    })
    console.log("profile", data.profilePic);
    
  }


  const handleSubmit = async(e) => {
    e.preventDefault()

    if (data.password === data.ConfirmPassword) {
      const dataResponse = await fetch(SummaryApi.signUp.url, {
        method:SummaryApi.signUp.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      })
      const dataApi = await dataResponse.json()

      if (dataApi.success) {
        toast.success(dataApi.message)
        navigate("/login")
      }
      if (dataApi.error) {
        toast.error(dataApi.message)
      }
    }
    else {
      console.log("please check password and confirm password");
      toast.error("please check password and confirm password")
      
    }
  }


  console.log("data :", data);
  return (
    <section id='signup'>
      <div className='mx-auto container p-4'>

        <div className='bg-white p-5 w-full max-w-sm mx-auto'>

          <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
            <div>
              <img src={data.profilePic || loginIcons} alt='login icon' />
            </div>
            <form>
              <label>
                <div className='text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 text-center absolute bottom-0 w-full cursor-pointer'>
                  Upload photo</div>
                <input type='file' className='hidden' onChange={handleUploadPic} />
              </label>
            </form>
          </div>

          <form className='mt-8 flex flex-col gap-2' onSubmit={handleSubmit}>

            <div className='grid'>
              <label>User name : </label>
              <div className='bg-slate-100 p-2'>
                <input type="text"
                  placeholder='enter user name'
                  name='name'
                  required
                  value={data.name}
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent'></input>
              </div>
            </div>

            <div className='grid'>
              <label>Email : </label>
              <div className='bg-slate-100 p-2'>
                <input type="email"
                  placeholder='enter email'
                  name='email'
                  required
                  value={data.email}
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent'></input>
              </div>
            </div>

            <div>
              <label>Password : </label>
              <div className='bg-slate-100 p-2 flex'>
                <input type={showPassword ? "text" : "password"}
                  placeholder='enter password'
                  value={data.password}
                  name='password'
                  required
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent' />
                <div className='cursor-pointer text-xl' onClick={() => setShowPassword((preve) => !preve)}>
                  <span>
                    {
                      showPassword ? (
                        <FaEyeSlash />
                      )
                        :
                        (
                          <FaEye />
                        )
                    }
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label>Confirm Password : </label>
              <div className='bg-slate-100 p-2 flex'>
                <input type={showConfirmPassword ? "text" : "password"}
                  placeholder='enter confirm password'
                  value={data.ConfirmPassword}
                  name='ConfirmPassword'
                  required
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent' />
                <div className='cursor-pointer text-xl' onClick={() => setShowConfirmPassword((preve) => !preve)}>
                  <span>
                    {
                      showConfirmPassword ? (
                        <FaEyeSlash />
                      )
                        :
                        (
                          <FaEye />
                        )
                    }
                  </span>
                </div>
              </div>
            </div>

            <button className='bg-black text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 hover:bg-gray-800'>Sign up</button>
          </form>
          <p className='my-5'>Already have an account? <Link to={"/login"} className='text-red-500 hover:text-red-600 hover:underline'> Login </Link> </p>
        </div>
      </div>
    </section>
  )
}

export default SignUp