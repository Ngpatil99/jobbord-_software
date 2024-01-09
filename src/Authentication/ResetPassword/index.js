import React, { useState } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useParams,useNavigate } from "react-router-dom";

import { backend_url } from '../../constant'
import './index.css'
import logo from '../../assets/icon/logo.svg'
import 'react-toastify/dist/ReactToastify.css';
import RightSidePanel from '../../component/RightSidePanel';

const ResetPassword = () => {
  let navigate = useNavigate();
  let params = useParams();
  const [password, setpassword] = useState("")
  const [passwordView,setpasswordView]=useState(false)
  const [confirmPassword,setconfirmPassword]=useState("")
  const [confirmPasswordView,setconfirmPasswordView]=useState(false)
  const [strength,setstrength]=useState("Poor")
  const [loading,setloading]=useState(false)
  
  

  const resetPassword=async()=>{
    try{
    if(password===confirmPassword&&strength==="Strong"){
    setloading(true)
    if(password===""){
      toast("Hey! newpassword field is empty",{
        className: 'toast-message'
      })
    }else if(confirmPassword===""){
      toast("Hey! confirmpassword field is empty",{
        className: 'toast-message'
      })
    
    }else{
     await axios.put(`${backend_url}eqa/resetpassword`,{
      email:params.email,
      newpassword:password,
      confirmpassword:confirmPassword
    })
      setloading(false)
      toast("password change",{
        className: 'toast-message'
      })
      navigate("/")
    
    }
    }else{
      setloading(false)
      toast("New password and confirm password are not sames",{
        className: 'toast-message'
      })
    }
    
    }catch(error){
      setloading(false)
      toast(error.response.data.error,{
        className: 'toast-message'
      })
    }
  }

   const changenewPassword=(e)=>{
    setpassword(e.target.value)
    
  }

  const changeconfirmPassword=(e)=>{
    passwordStrength(e.target.value)
    setconfirmPassword(e.target.value)
    
  }

   const passwordStrength=(evnt)=>{
    const passwordValue= evnt;
    const passwordLength= passwordValue.length;
    const poorRegExp = /[a-z]/;
    const weakRegExp = /(?=.*?[0-9])/;;
    const strongRegExp = /(?=.*?[#?!@$%^&*-])/;
    //const whitespaceRegExp = /^$|\s+/;
    const poorPassword= poorRegExp.test(passwordValue);
    const weakPassword= weakRegExp.test(passwordValue);
    const strongPassword= strongRegExp.test(passwordValue);
    
        // to check poor password
        if(passwordLength <= 3 && (poorPassword || weakPassword || strongPassword))
        {
        setstrength("Poor");
        }
        // to check weak password
        if(passwordLength>= 4 && poorPassword && (weakPassword || strongPassword))
        {
            setstrength("Medium");
        }
        // to check strong Password
        if(passwordLength >= 6 && (poorPassword && weakPassword) && strongPassword)
        {
          setstrength("Strong");
        }
    
}
 
  return (
    <>
    <ToastContainer/>
    <div className='reset-password-container' >
      {/*left side container */}
      <div className='left' >
        {/*company logo */}
        <img src={logo} alt="company logo" />

        <span>Reset Password</span>

        <p>Strong password gives better security</p>
        
        {/*password container */}
        <div style={{marginTop:42}} className='password-container' >
          <label>New Password</label>
          <input placeholder='Enter new password' value={password} onChange={changenewPassword} type={passwordView?"password":"text"} />
          {/*eye icon */}
          {passwordView?
          <svg onClick={()=>setpasswordView(!passwordView)} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2171_2043)">
              <path d="M0.916992 11.0003C0.916992 11.0003 4.58366 3.66699 11.0003 3.66699C17.417 3.66699 21.0837 11.0003 21.0837 11.0003C21.0837 11.0003 17.417 18.3337 11.0003 18.3337C4.58366 18.3337 0.916992 11.0003 0.916992 11.0003Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M11 13.75C12.5188 13.75 13.75 12.5188 13.75 11C13.75 9.48122 12.5188 8.25 11 8.25C9.48122 8.25 8.25 9.48122 8.25 11C8.25 12.5188 9.48122 13.75 11 13.75Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_2171_2043">
                <rect width="22" height="22" fill="white" />
              </clipPath>
            </defs>
          </svg>:
            <svg onClick={()=>setpasswordView(!passwordView)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#AAAAAA" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#AAAAAA" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }

        </div>
        
        <div style={{marginTop:20}} className='password-container' >
          <label>Confirm Password</label>
          <input placeholder='Enter confirm password' value={confirmPassword} onChange={changeconfirmPassword} type={confirmPasswordView?"password":"text"} />
          {/*eye icon */}
          {confirmPasswordView?
          <svg onClick={()=>setconfirmPasswordView(!confirmPasswordView)} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2171_2043)">
              <path d="M0.916992 11.0003C0.916992 11.0003 4.58366 3.66699 11.0003 3.66699C17.417 3.66699 21.0837 11.0003 21.0837 11.0003C21.0837 11.0003 17.417 18.3337 11.0003 18.3337C4.58366 18.3337 0.916992 11.0003 0.916992 11.0003Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M11 13.75C12.5188 13.75 13.75 12.5188 13.75 11C13.75 9.48122 12.5188 8.25 11 8.25C9.48122 8.25 8.25 9.48122 8.25 11C8.25 12.5188 9.48122 13.75 11 13.75Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_2171_2043">
                <rect width="22" height="22" fill="white" />
              </clipPath>
            </defs>
          </svg>:
            <svg onClick={()=>setconfirmPasswordView(!confirmPasswordView)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#AAAAAA" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#AAAAAA" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }

        </div>

        <div className='passwordStrength' >
            <label>{strength}</label>
            <span className={strength==="Strong"?'strong':strength==="Medium"?'medium':strength==="Poor"?'poor':''} ></span>
        </div>

        {/*login button */}
        <button onClick={resetPassword} >
          {loading?<div className='loader' ></div>:"Reset password"}
        </button>
      </div>

      {/*right side container */}
      <RightSidePanel/>

    </div>
    </>
  )
}

export default ResetPassword