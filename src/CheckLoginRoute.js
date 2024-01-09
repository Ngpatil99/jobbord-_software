
import React from 'react'
import { Navigate } from 'react-router-dom'
import {getCookie, deleteAllCookie} from '../src/constant'
import jwt_decode from 'jwt-decode';

const CheckLoginRoute = ({ children }) => {
  
    const token = getCookie("Xh7ERL0G")
    
   
    if(token!==null && token !== undefined){
        const decoded = jwt_decode(token);
        const expirationTime = (decoded.exp * 1000)- 60000;
        
        if(Date.now() <= expirationTime) {return <Navigate to="/dashboard" />;}else{
            deleteAllCookie()
            return window.open("https://theeliteqa.com/", "_self");
        }
    }
    // decode the jwt token and check the expiration time
   
    // if token is not there redirect to login or token expired
     return children
}

export default CheckLoginRoute