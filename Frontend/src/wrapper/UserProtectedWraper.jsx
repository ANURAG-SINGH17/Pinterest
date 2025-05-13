import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const UserProtectedWraper = ({children}) => {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if(!token){
      navigate('/')
    }
  },[])

  return (
    <>
    {children}
    </>
  )
}

export default UserProtectedWraper
