import React, { useState } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import { backend_url } from '../../constant'
import './index.css'
import logo from '../../assets/icon/logo.svg'
import 'react-toastify/dist/ReactToastify.css';
import RightSidePanel from '../../component/RightSidePanel';

const Login = () => {
  let navigate = useNavigate();

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [passwordView, setpasswordView] = useState(true)
  const [remeberMe, setremeberMe] = useState(false)
  const [loading, setloading] = useState(false)

  function isEmail(val) {
    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;//eslint-disable-line
    if (!regEmail.test(val)) {
      return 'Invalid Email';
    }
  }

  function setCookie(name, value) {
    if (process.env.NODE_ENV === 'development') {
      document.cookie = `${name}=${value}`
    } else {
      document.cookie = `${name}=${value}; domain=.theeliteqa.com`
    }
  }

  const loginUser = async () => {
    try {
      setloading(true)
      if (email === "") {
        toast("Hey! email can't be empty!", {
          className: 'toast-message'
        })
        setloading(false)
      } else if (password === "") {
        toast("Hey! password can't be empty!", {
          className: 'toast-message'
        })
        setloading(false)
      } else {
        const res = await axios.post(`${backend_url}eqa/login`, {
          password: password,
          email: email
        })
        setCookie("Xh7ERL0G", res.data.token)
        
        toast("Log in user sucessfully!")
        setloading(false)
        navigate("/dashboard")
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('profile',res.data.data.profileUrl)


      }
    }
    catch (error) {
      setloading(false)
      toast(error.response.data.error, {
        className: 'toast-message'
      })
    }
  }

  return (
    <>
      
      <div className='login-container' >
        {/*left side container */}
        <div className='left' >
          {/*company logo */}
          <img src={logo} alt="company logo" />

          <span>Sign In</span>

          <p>Let’s get started to hire some best talents </p>
          {/*email input container */}
          <div style={isEmail(email) === "Invalid Email" && email !== "" ? { borderColor: 'red' } : isEmail(email) !== "Invalid Email" ? { borderColor: '#00C49A' } : {}} className='input-container' >
            <label style={isEmail(email) === "Invalid Email" && email !== "" ? { color: 'red' } : isEmail(email) !== "Invalid Email" ? { color: '#00C49A' } : {}} >Your Email/Username</label>
            <input value={email} type="text" placeholder='Enter email' onChange={(e) => setemail(e.target.value)} />
          </div>
          {email !== "" ?
            <div className='invalid-email' >{isEmail(email)}</div> : <div className='valid-email' ></div>
          }
          {/*password container */}
          <div className='password-container' >
            <label>Enter Password</label>
            <input placeholder='Enter password' value={password} onChange={(e) => setpassword(e.target.value)} type={passwordView ? "password" : "text"} />
            {/*eye icon */}
            {passwordView ?
              <svg onClick={() => setpasswordView(!passwordView)} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_2171_2043)">
                  <path d="M0.916992 11.0003C0.916992 11.0003 4.58366 3.66699 11.0003 3.66699C17.417 3.66699 21.0837 11.0003 21.0837 11.0003C21.0837 11.0003 17.417 18.3337 11.0003 18.3337C4.58366 18.3337 0.916992 11.0003 0.916992 11.0003Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M11 13.75C12.5188 13.75 13.75 12.5188 13.75 11C13.75 9.48122 12.5188 8.25 11 8.25C9.48122 8.25 8.25 9.48122 8.25 11C8.25 12.5188 9.48122 13.75 11 13.75Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_2171_2043">
                    <rect width="22" height="22" fill="white" />
                  </clipPath>
                </defs>
              </svg> :
              <svg onClick={() => setpasswordView(!passwordView)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#AAAAAA" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#AAAAAA" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }

          </div>
          {/*forgot password & remeber me container */}
          <div className='forgot-password-remeber-button-container' >
            {/* <div className='remeber-me' >
              <div onClick={() => setremeberMe(!remeberMe)} style={remeberMe ? {} : { borderRadius: 2, borderColor: 'black', borderWidth: 1, borderStyle: 'solid', backgroundColor: 'white' }} className='checbox-container' >
                {remeberMe ?
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.35974 3.2801C1.9667 2.89211 1.33354 2.89621 0.945556 3.28925C0.557569 3.6823 0.561669 4.31545 0.954713 4.70344L3.49567 7.2117C3.91369 7.62434 4.59566 7.58954 4.9695 7.13648L9.09521 2.13648C9.44671 1.71049 9.38633 1.08021 8.96034 0.728708C8.53435 0.377208 7.90407 0.437592 7.55257 0.863579L4.12266 5.02033L2.35974 3.2801Z" fill="white" />
                  </svg> : <></>
                }
              </div>
              <p>Remember Me</p>
              </div> */}
            <label onClick={() => navigate('/forgotpassword')} >Forgot Password</label>
          </div>
          {/*login button */}
          <button onClick={loginUser} >
            {loading ? <div className='loader' ></div> : "Login"}
          </button>
        </div>

        {/*right side container */}
        <RightSidePanel />

      </div>
    </>
  )
}

export default Login