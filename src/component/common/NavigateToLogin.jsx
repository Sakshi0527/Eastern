import React from 'react'
import { Navigate } from 'react-router-dom'
import { RouteConstants } from '../../routes/RouteConstants'

const NavigateToLogin = () => {
  return (
    <Navigate to={RouteConstants.LOGIN}/>
  )
}

export default NavigateToLogin
