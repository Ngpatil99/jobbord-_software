import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie, deleteAllCookie } from '../src/constant';
import jwt_decode from 'jwt-decode';

const ProtectedRoutes = ({ children }) => {
  const token = getCookie('Xh7ERL0G');

  if (token === null || token === undefined) {
       return <Navigate to="https://theeliteqa.com/" replace />;
     //return <Navigate to="http://localhost:3000/" replace />;
  }

  const decoded = jwt_decode(token);
  const expirationTime = decoded.exp * 1000 - 60000;

  if (token === null || Date.now() >= expirationTime || token === undefined) {
    deleteAllCookie();
    return <Navigate to="https://theeliteqa.com/" replace />;
    //return <Navigate to="http://localhost:3000/" replace />;
  }

  return children;
};

export default ProtectedRoutes;
